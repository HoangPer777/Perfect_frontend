"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { chatService, Conversation, ChatMessage } from "@/services/chat/chat.service";
import { MessageSquare, Send, Search, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token, isAuthenticated } = useAuthStore();

  const contactIdParam = searchParams.get("userId");
  const contactNameParam = searchParams.get("name");
  const contactAvatarParam = searchParams.get("avatar");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeConversationRef = useRef<Conversation | null>(null);
  
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setConversations((prev) =>
      prev.map((c) =>
        c.contactId === conv.contactId ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/login?redirect=/chat");
    }
  }, [isAuthenticated, token, router]);

  // Load conversations list
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      setError(null);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (err: any) {
      console.error(err);
      setError("Không thể tải danh sách cuộc hội thoại.");
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  // Process query parameters to open specific chat
  useEffect(() => {
    if (loadingConversations) return;

    if (contactIdParam) {
      const found = conversations.find((c) => c.contactId === contactIdParam);
      if (found) {
        setActiveConversation(found);
      } else {
        const tempConv: Conversation = {
          contactId: contactIdParam,
          contactName: contactNameParam || "Designer",
          contactUsername: contactNameParam || "designer",
          contactAvatar: contactAvatarParam || null,
          lastMessage: "Bắt đầu cuộc trò chuyện mới...",
          lastMessageTimestamp: new Date().toISOString(),
        };
        setConversations((prev) => [tempConv, ...prev]);
        setActiveConversation(tempConv);
      }
    }
  }, [contactIdParam, contactNameParam, contactAvatarParam, loadingConversations]);

  // Load chat history when activeConversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const loadHistory = async () => {
      try {
        setLoadingMessages(true);
        const history = await chatService.getChatHistory(activeConversation.contactId);
        setMessages(history);
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadHistory();
  }, [activeConversation]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!token || !user) return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const wsBase = apiBaseUrl.replace("http://", "ws://").replace("https://", "wss://");
    const wsUrl = `${wsBase.replace("/api/v1", "/ws/chat")}?token=${encodeURIComponent(token)}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg: ChatMessage = JSON.parse(event.data);

        // Update messages list if it belongs to current active chat
        setActiveConversation((currentActive) => {
          if (
            currentActive &&
            (currentActive.contactId === msg.senderId || currentActive.contactId === msg.receiverId)
          ) {
            setMessages((prevMsgs) => {
              if (prevMsgs.some((m) => m.id === msg.id)) return prevMsgs;
              return [...prevMsgs, msg];
            });
          }
          return currentActive;
        });

        // Update conversations sidebar item
        setConversations((prevConvs) => {
          const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
          const existingIdx = prevConvs.findIndex((c) => c.contactId === partnerId);

          const currentActive = activeConversationRef.current;
          const isFromPartnerAndNotActive = msg.senderId === partnerId && 
            (!currentActive || currentActive.contactId !== partnerId);

          if (existingIdx > -1) {
            const updated = [...prevConvs];
            const currentUnread = updated[existingIdx].unreadCount || 0;
            updated[existingIdx] = {
              ...updated[existingIdx],
              lastMessage: msg.content,
              lastMessageTimestamp: msg.timestamp,
              unreadCount: isFromPartnerAndNotActive ? currentUnread + 1 : 0,
            };
            // Move updated conversation to the top
            const item = updated.splice(existingIdx, 1)[0];
            return [item, ...updated];
          } else {
            // Reload conversations to pull contact information for new chat partner
            chatService.getConversations().then(data => setConversations(data)).catch(console.error);
            return prevConvs;
          }
        });
      } catch (err) {
        console.error("Failed to parse WebSocket message", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [token, user]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation || !socketRef.current) return;

    const payload = {
      receiverId: activeConversation.contactId,
      content: inputValue.trim(),
    };

    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      setInputValue("");
    } else {
      alert("Mất kết nối với máy chủ. Vui lòng đợi trong giây lát hoặc tải lại trang.");
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const name = c.contactName?.toLowerCase() || "";
    const username = c.contactUsername?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || username.includes(query);
  });

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#F8FAFC]">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:py-8 h-[calc(100vh-80px)] min-h-[500px]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] h-full overflow-hidden flex">
        
        {/* SIDEBAR: CONVERSATIONS LIST */}
        <aside
          className={`${
            activeConversation ? "hidden md:flex" : "flex"
          } w-full md:w-[350px] shrink-0 border-r border-gray-100 flex-col bg-[#FCFCFD] h-full`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="text-purple-600" size={20} />
              Hộp thư thoại
            </h1>
          </div>

          {/* Sidebar Search */}
          <div className="p-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm liên hệ..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Conversations list container */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {loadingConversations ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <Loader2 size={24} className="animate-spin text-purple-500" />
                <span className="text-xs">Đang tải tin nhắn...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">Không tìm thấy cuộc trò chuyện nào.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?.contactId === conv.contactId;
                return (
                  <button
                    key={conv.contactId}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                      isActive
                        ? "bg-purple-50/70 border border-purple-100 shadow-sm"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {/* Contact Avatar */}
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-200 border border-white shadow-2xs">
                      {conv.contactAvatar ? (
                        <img
                          src={conv.contactAvatar}
                          alt={conv.contactName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                          {conv.contactName ? conv.contactName.substring(0, 2) : "US"}
                        </div>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`text-sm truncate ${(conv.unreadCount ?? 0) > 0 ? "font-black text-gray-900" : "font-bold text-gray-800"}`}>
                          {conv.contactName}
                        </h4>
                        <span className={`text-[10px] ${(conv.unreadCount ?? 0) > 0 ? "font-bold text-purple-600" : "text-gray-400"}`}>
                          {formatTime(conv.lastMessageTimestamp)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${(conv.unreadCount ?? 0) > 0 ? "font-bold text-gray-950" : "text-gray-500"}`}>
                          {conv.lastMessage}
                        </p>
                        {(conv.unreadCount ?? 0) > 0 && (
                          <span className="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 min-w-4 text-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* MAIN WINDOW: CHAT BOX */}
        <main
          className={`${
            activeConversation ? "flex" : "hidden md:flex"
          } flex-1 flex-col h-full bg-white`}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="p-2 -ml-2 text-gray-500 hover:text-gray-800 md:hidden rounded-full hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200 border">
                  {activeConversation.contactAvatar ? (
                    <img
                      src={activeConversation.contactAvatar}
                      alt={activeConversation.contactName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {activeConversation.contactName
                        ? activeConversation.contactName.substring(0, 2)
                        : "US"}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {activeConversation.contactName}
                  </h3>
                  <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Đang trực tuyến
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9FC] space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-purple-600" size={28} />
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwnMessage = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-[24px] px-5 py-3 text-sm shadow-2xs ${
                            isOwnMessage
                              ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-br-none"
                              : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                          }`}
                        >
                          <p className="leading-relaxed break-words">{msg.content}</p>
                          <span
                            className={`block text-[9px] mt-1.5 text-right ${
                              isOwnMessage ? "text-purple-100" : "text-gray-400"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Footer Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-100 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập nội dung tin nhắn..."
                  className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 focus:border-purple-500 rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-purple-100"
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 p-8">
              <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-4 shadow-sm border border-purple-100/30">
                <MessageSquare size={28} />
              </div>
              <h3 className="font-bold text-gray-700 mb-1">Hộp thư trò chuyện</h3>
              <p className="text-xs text-gray-400 max-w-[280px] text-center leading-relaxed">
                Chọn một liên hệ từ danh sách bên trái hoặc nhấn nút liên hệ trực tiếp từ trang chi tiết của Designer để bắt đầu nhắn tin.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#F8FAFC]">
            <Loader2 size={36} className="animate-spin text-purple-600" />
          </div>
        }
      >
        <ChatContent />
      </Suspense>
    </>
  );
}
