"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  MapPin, 
  Sliders, 
  Shield, 
  CreditCard, 
  Camera, 
  Loader2, 
  Check,
  ChevronRight
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

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-[#1f2937] tracking-tight">Atelier Market Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer profile settings and preferences.</p>
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
              {user.role === "DESIGNER" ? "Creative Designer" : "Premium Collector"}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">
              Member Since 2026
            </p>

            {/* Sidebar Tabs */}
            <div className="w-full mt-8 space-y-2 border-t border-gray-50 pt-6">
              <button 
                onClick={() => setActiveTab("personal")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "personal" ? "bg-purple-50/50 text-[#6b5b95]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                <div className="flex items-center gap-3">
                  <User size={16} />
                  <span>Personal Info</span>
                </div>
                {activeTab === "personal" && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={() => setActiveTab("addresses")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "addresses" ? "bg-purple-50/50 text-[#6b5b95]" : "text-gray-400 hover:bg-gray-50/40"}`}
              >
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>Addresses</span>
                </div>
                {activeTab === "addresses" && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={() => setActiveTab("preferences")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "preferences" ? "bg-purple-50/50 text-[#6b5b95]" : "text-gray-400 hover:bg-gray-50/40"}`}
              >
                <div className="flex items-center gap-3">
                  <Sliders size={16} />
                  <span>Preferences</span>
                </div>
                {activeTab === "preferences" && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={() => setActiveTab("security")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "security" ? "bg-purple-50/50 text-[#6b5b95]" : "text-gray-400 hover:bg-gray-50/40"}`}
              >
                <div className="flex items-center gap-3">
                  <Shield size={16} />
                  <span>Security</span>
                </div>
                {activeTab === "security" && <ChevronRight size={14} />}
              </button>

              <button 
                onClick={() => setActiveTab("payment")}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === "payment" ? "bg-purple-50/50 text-[#6b5b95]" : "text-gray-400 hover:bg-gray-50/40"}`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={16} />
                  <span>Payment</span>
                </div>
                {activeTab === "payment" && <ChevronRight size={14} />}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Form */}
          <div className="md:col-span-8 bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_30px_rgba(0,0,0,0.02)] p-8 md:p-10">
            {activeTab === "personal" ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Personal Information */}
                <div>
                  <h3 className="text-base font-bold text-gray-800 border-l-[3px] border-[#6b5b95] pl-3 mb-6">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        Last Name
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
                        First Name
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
                        Email Address
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
                    Address & Location
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        City
                      </label>
                      <input 
                        type="text"
                        placeholder="Ho Chi Minh City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6]/80 border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">
                        Detailed Address
                      </label>
                      <input 
                        type="text"
                        placeholder="Thu Duc District, Ho Chi Minh City"
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
                    Communication Preferences
                  </h3>

                  <div className="space-y-4">
                    {/* Email Notifications Toggle */}
                    <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-gray-50">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">Email Notifications</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Stay updated on your bid status and artist news.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`w-11 h-6 rounded-full transition-all duration-250 relative ${emailNotifications ? "bg-[#6b5b95]" : "bg-gray-200"}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-250 ${emailNotifications ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Promotional Offers Toggle */}
                    <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-gray-50">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">Promotional Offers</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Receive exclusive invites to private auctions and seasonal events.</p>
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
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 rounded-full bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-75 disabled:scale-100"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>

              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-400 text-sm">This tab section is currently a visual placeholder.</p>
                <button 
                  onClick={() => setActiveTab("personal")}
                  className="text-xs font-bold text-purple-600 mt-2 hover:underline"
                >
                  Return to Personal Info
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
