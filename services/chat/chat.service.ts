import api from "@/lib/api";

export interface Conversation {
  contactId: string;
  contactName: string;
  contactUsername: string;
  contactAvatar: string | null;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export const chatService = {
  getConversations: async () => {
    const response = await api.get<Conversation[]>("/chat/conversations");
    return response.data;
  },

  getChatHistory: async (contactId: string) => {
    const response = await api.get<ChatMessage[]>(`/chat/history/${contactId}`);
    return response.data;
  },
};
