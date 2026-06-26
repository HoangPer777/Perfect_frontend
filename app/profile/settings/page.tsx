"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Camera, 
  Loader2, 
  Check,
  ChevronRight,
  ShoppingBag,
  Award,
  Lock,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { cloudinary } from "@/services/cloudinary/upload.service";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, token, updateUser, isAuthenticated } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [city, setCity] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [promotionalOffers, setPromotionalOffers] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  // New tab states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccessMsg, setPwdSuccessMsg] = useState("");
  const [pwdErrorMsg, setPwdErrorMsg] = useState("");

  const [purchasedTasks, setPurchasedTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Designer Upgrade Form states
  const [specialization, setSpecialization] = useState("Thiết kế Banner");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceYears, setExperienceYears] = useState(1);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  
  const [designerLoading, setDesignerLoading] = useState(false);
  const [designerSuccessMsg, setDesignerSuccessMsg] = useState("");
  const [designerErrorMsg, setDesignerErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    // Populate data from store
    const nameParts = (user.fullName || "").trim().split(" ");
    if (nameParts.length > 1) {
      setLastName(nameParts[0]);
      setFirstName(nameParts.slice(1).join(" "));
    } else {
      setLastName("");
      setFirstName(user.fullName || "");
    }
    
    setUsername(user.username || "");
    setAvatarUrl(user.avatarUrl || "");
    setCity(user.city || "");
    setDetailedAddress(user.detailedAddress || "");
    setEmailNotifications(user.emailNotifications ?? true);
    setPromotionalOffers(user.promotionalOffers ?? false);
  }, [user, isAuthenticated, router]);

  // Load Purchased Tasks
  useEffect(() => {
    if (activeTab === "purchase_history" && isAuthenticated && token) {
      setLoadingTasks(true);
      setErrorMsg("");
      authService.getPurchasedTasks()
        .then((data) => {
          setPurchasedTasks(data);
        })
        .catch((err) => {
          console.error(err);
          setErrorMsg("Không thể lấy lịch sử mua hàng.");
        })
        .finally(() => {
          setLoadingTasks(false);
        });
    }
  }, [activeTab, isAuthenticated, token]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#6b5b95] animate-spin" />
      </div>
    );
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");
    try {
      const sig = await cloudinary.getSignature("avatars");
      const res = await cloudinary.uploadSingleImage(file, sig);
      setAvatarUrl(res.secure_url);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to upload avatar image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const fullName = `${lastName} ${firstName}`.trim();

    try {
      const updatedUser = await authService.updateProfile({
        fullName,
        username,
        avatarUrl,
        city,
        detailedAddress,
        emailNotifications,
        promotionalOffers
      });

      // Update Zustand Store
      updateUser({
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        avatarUrl: updatedUser.avatarUrl,
        city: updatedUser.city,
        detailedAddress: updatedUser.detailedAddress,
        emailNotifications: updatedUser.emailNotifications,
        promotionalOffers: updatedUser.promotionalOffers
      });

      setSuccessMsg("Profile updated successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to update profile.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }
    setPwdLoading(true);
    setPwdSuccessMsg("");
    setPwdErrorMsg("");
    try {
      await authService.changePassword({ oldPassword, newPassword });
      setPwdSuccessMsg("Mật khẩu đã được đổi thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      setPwdErrorMsg(err.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleUpgradeToDesigner = async (e: React.FormEvent) => {
    e.preventDefault();
    setDesignerLoading(true);
    setDesignerSuccessMsg("");
    setDesignerErrorMsg("");
    try {
      await authService.upgradeToDesigner({
        specialization,
        bio,
        portfolioUrl,
        skills,
        experienceYears: Number(experienceYears) || 0
      });
      setDesignerSuccessMsg("Chúc mừng! Bạn đã nâng cấp thành Designer thành công. Đang chuyển hướng...");
      
      // Update store role
      updateUser({ 
        role: "ROLE_DESIGNER" as any,
        specialization,
        bio,
        portfolioUrl,
        skills,
        experienceYears: Number(experienceYears) || 0
      });
      
      setTimeout(() => {
        router.push("/designer");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setDesignerErrorMsg(err.response?.data?.message || "Không thể nâng cấp lên Designer. Vui lòng thử lại.");
    } finally {
      setDesignerLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#1f2937] tracking-tight">Cài đặt tài khoản</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý thông tin cá nhân và lịch sử dịch vụ của bạn.</p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-medium flex items-center gap-2 animate-in fade-in duration-300">
            <Check className="w-5 h-5" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-sm font-medium animate-in fade-in duration-300">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Sidebar Profile Card */}
          <div className="md:col-span-4 bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] p-8 flex flex-col items-center">
            
            {/* Avatar container */}
            <div className="relative w-28 h-28 mb-6 group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-full h-full rounded-full border-4 border-purple-50 overflow-hidden bg-slate-100 flex items-center justify-center shadow-md">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-[#6b5b95] animate-spin" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt={user.fullName || "User Avatar"} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-2xl font-bold text-gray-400 uppercase">
                    {user.username ? user.username.substring(0, 2) : "US"}
                  </div>
                )}
              </div>
              <button 
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-100 text-gray-600 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-200"
              >
                <Camera size={14} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* User Meta */}
            <h2 className="text-lg font-bold text-[#1f2937] leading-tight text-center">
              {lastName} {firstName || user.username || "Atelier User"}
            </h2>
            <p className="text-xs font-semibold text-purple-600 tracking-wider uppercase mt-1">
              {user.role === "ROLE_DESIGNER" || user.role === "DESIGNER" ? "Creative Designer" : "Premium Collector"}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
              Member Since 2026
            </p>

            {/* Sidebar Tabs */}
            <div className="w-full mt-8 space-y-2 border-t border-gray-50 pt-6">
              <button 
                onClick={() => setActiveTab("personal")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "personal" ? "bg-[#6b5b95]/10 text-[#6b5b95]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                <div className="flex items-center gap-3">
                  <User size={16} />
                  <span>Thông tin cá nhân</span>
                </div>
                {activeTab === "personal" && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={() => setActiveTab("purchase_history")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "purchase_history" ? "bg-[#6b5b95]/10 text-[#6b5b95]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={16} />
                  <span>Lịch sử mua hàng</span>
                </div>
                {activeTab === "purchase_history" && <ChevronRight size={14} />}
              </button>

              {user.provider === "LOCAL" && (
                <button 
                  onClick={() => setActiveTab("change_password")}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "change_password" ? "bg-[#6b5b95]/10 text-[#6b5b95]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
                >
                  <div className="flex items-center gap-3">
                    <Lock size={16} />
                    <span>Đổi mật khẩu</span>
                  </div>
                  {activeTab === "change_password" && <ChevronRight size={14} />}
                </button>
              )}

              {(user.role === "CUSTOMER" || user.role === "ROLE_CUSTOMER") && (
                <button 
                  onClick={() => setActiveTab("upgrade_designer")}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "upgrade_designer" ? "bg-[#6b5b95]/10 text-[#6b5b95]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
                >
                  <div className="flex items-center gap-3">
                    <Award size={16} />
                    <span>Nâng cấp Designer</span>
                  </div>
                  {activeTab === "upgrade_designer" && <ChevronRight size={14} />}
                </button>
              )}

              {(user.role === "DESIGNER" || user.role === "ROLE_DESIGNER") && (
                <button 
                  onClick={() => router.push("/designer")}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold text-purple-600 hover:bg-purple-50/50"
                >
                  <div className="flex items-center gap-3">
                    <Award size={16} className="text-purple-600 animate-pulse" />
                    <span>Trang quản lý Designer</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Tab Panel Content */}
          <div className="md:col-span-8 bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] p-8 md:p-10">
            
            {/* Personal Info Tab Panel */}
            {activeTab === "personal" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-base font-bold text-gray-800 border-l-[3px] border-[#6b5b95] pl-3 mb-6">
                    Thông tin cá nhân
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        Họ
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Lê"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        Tên
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Trọng Nghĩa"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        Địa chỉ Email
                      </label>
                      <input 
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full h-[50px] px-4 rounded-[16px] bg-gray-50 border-none text-[15px] text-gray-400 font-medium cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        Username
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Address & Location */}
                <div className="pt-4">
                  <h3 className="text-base font-bold text-gray-800 border-l-[3px] border-[#6b5b95] pl-3 mb-6">
                    Địa chỉ & Vị trí
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        Tỉnh / Thành phố
                      </label>
                      <input 
                        type="text"
                        placeholder="Hồ Chí Minh"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        Địa chỉ chi tiết
                      </label>
                      <input 
                        type="text"
                        placeholder="Số nhà, Tên đường, Quận/Huyện"
                        value={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                        className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Communication Preferences */}
                <div className="pt-4">
                  <h3 className="text-base font-bold text-gray-800 border-l-[3px] border-[#6b5b95] pl-3 mb-6">
                    Tùy chọn nhận thông báo
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-gray-50">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">Thông báo qua Email</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Nhận cập nhật về các đơn hàng thiết kế và tin nhắn hệ thống.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`w-11 h-6 rounded-full transition-all duration-250 relative ${emailNotifications ? "bg-[#6b5b95]" : "bg-gray-200"}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-250 ${emailNotifications ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-gray-50">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">Ưu đãi & Khuyến mãi</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Nhận các thông tin sự kiện độc quyền và voucher giảm giá.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPromotionalOffers(!promotionalOffers)}
                        className={`w-11 h-6 rounded-full transition-all duration-250 relative ${promotionalOffers ? "bg-[#6b5b95]" : "bg-gray-200"}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-250 ${promotionalOffers ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-6 pt-6 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    HỦY BỎ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 rounded-full bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-75 disabled:scale-100"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            )}

            {/* Purchase History Tab Panel */}
            {activeTab === "purchase_history" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-800 border-l-[3px] border-[#6b5b95] pl-3 mb-2">
                    Lịch sử mua hàng
                  </h3>
                  <p className="text-xs text-gray-400 ml-4">
                    Quản lý và theo dõi tiến độ các gói dịch vụ bạn đã mua.
                  </p>
                </div>

                {loadingTasks ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[#6b5b95] animate-spin" />
                  </div>
                ) : purchasedTasks.length === 0 ? (
                  <div className="text-center py-12 bg-[#f8fafc] rounded-2xl border border-dashed border-gray-200">
                    <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-500">Bạn chưa mua gói dịch vụ nào</p>
                    <p className="text-xs text-gray-400 mt-1">Khám phá các dịch vụ thiết kế của chúng tôi để bắt đầu.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tên dịch vụ</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Designer</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Chi phí</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ngày mua</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {purchasedTasks.map((task) => {
                            let statusColor = "bg-yellow-50 text-yellow-600 border border-yellow-100";
                            let statusName = task.status;
                            if (task.status === "COMPLETED") {
                              statusColor = "bg-emerald-50 text-emerald-600 border border-emerald-100";
                              statusName = "Hoàn thành";
                            } else if (task.status === "PROCESSING") {
                              statusColor = "bg-blue-50 text-blue-600 border border-blue-100";
                              statusName = "Đang làm";
                            } else if (task.status === "REVIEWING") {
                              statusColor = "bg-purple-50 text-purple-600 border border-purple-100";
                              statusName = "Khách duyệt";
                            } else if (task.status === "DISPUTED") {
                              statusColor = "bg-amber-50 text-amber-600 border border-amber-100";
                              statusName = "Tranh chấp";
                            } else if (task.status === "CANCELLED") {
                              statusColor = "bg-red-50 text-red-600 border border-red-100";
                              statusName = "Đã hủy";
                            } else if (task.status === "PENDING") {
                              statusName = "Chờ nhận";
                            }

                            return (
                              <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                  {task.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {task.designer ? (task.designer.fullName || task.designer.username) : "Chưa nhận"}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                  {task.actualPrice ? task.actualPrice.toLocaleString('vi-VN') + " ₫" : "Miễn phí"}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                                    {statusName}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString('vi-VN') : "N/A"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Change Password Tab Panel */}
            {activeTab === "change_password" && user.provider === "LOCAL" && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-800 border-l-[3px] border-[#6b5b95] pl-3 mb-2">
                    Đổi mật khẩu
                  </h3>
                  <p className="text-xs text-gray-400 ml-4">
                    Cập nhật mật khẩu tài khoản hệ thống của bạn để tăng độ bảo mật.
                  </p>
                </div>

                {pwdSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-medium flex items-center gap-2 animate-in fade-in">
                    <Check className="w-5 h-5" />
                    {pwdSuccessMsg}
                  </div>
                )}

                {pwdErrorMsg && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-sm font-medium animate-in fade-in">
                    {pwdErrorMsg}
                  </div>
                )}

                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                      Mật khẩu cũ
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full h-[50px] pl-11 pr-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-[50px] pl-11 pr-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-[50px] pl-11 pr-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-6 pt-6 border-t border-gray-50">
                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="h-12 px-8 rounded-full bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-75 disabled:scale-100"
                  >
                    {pwdLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            )}

            {/* Upgrade Designer Tab Panel */}
            {activeTab === "upgrade_designer" && (user.role === "CUSTOMER" || user.role === "ROLE_CUSTOMER") && (
              <form onSubmit={handleUpgradeToDesigner} className="space-y-8 animate-in fade-in">
                <div>
                  <h3 className="text-base font-bold text-gray-800 border-l-[3px] border-[#6b5b95] pl-3 mb-2">
                    Thông tin đăng ký Designer
                  </h3>
                  <p className="text-xs text-gray-400 ml-4">
                    Vui lòng điền thông tin chuyên môn bên dưới để kích hoạt tài khoản Designer của bạn.
                  </p>
                </div>

                {designerSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-medium flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {designerSuccessMsg}
                  </div>
                )}

                {designerErrorMsg && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl text-sm font-medium">
                    {designerErrorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                      Lĩnh vực chuyên môn chính
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all font-medium cursor-pointer"
                    >
                      <option value="Thiết kế Banner">Thiết kế Banner</option>
                      <option value="Chỉnh sửa ảnh">Chỉnh sửa ảnh</option>
                      <option value="Thiết kế Logo">Thiết kế Logo</option>
                      <option value="Minh họa / Vẽ tranh">Minh họa / Vẽ tranh</option>
                      <option value="Khác">Khác / Nhiều lĩnh vực</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                      Số năm kinh nghiệm
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value) || 0)}
                      className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                      Kỹ năng chính (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Photoshop, Illustrator, Figma, Lightroom"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                      Liên kết Portfolio sản phẩm nổi bật
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        placeholder="https://behance.net/username hoặc personal-portfolio.com"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="w-full h-[50px] pl-11 pr-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                      Giới thiệu ngắn về bản thân (Bio)
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Hãy viết một đoạn giới thiệu ngắn về phong cách thiết kế, điểm mạnh và các dự án thiết kế bạn tự hào nhất..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af] resize-none"
                    />
                  </div>
                </div>

                <div className="p-6 bg-purple-50/30 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-10 h-10 text-[#6b5b95]" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">Quyền lợi Designer cao cấp</p>
                      <p className="text-xs text-gray-400">Bạn sẽ có Portfolio riêng và bắt đầu kiếm tiền ngay lập tức.</p>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={designerLoading}
                    className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#6b5b95] to-[#7C3AED] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-75 disabled:scale-100"
                  >
                    {designerLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Xác nhận & Nâng cấp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
