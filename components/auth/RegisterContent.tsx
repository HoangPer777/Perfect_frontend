"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

export default function RegisterContent() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await authService.register({ fullName, email, password, role });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Registration Error:", err.response?.data || err.message);
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || errorData?.error || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || "http://localhost:8080";
    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
  };

  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError(null);
    try {
      await authService.verifyEmail(otp, email);
      setOtpSuccess(true);
    } catch (err: any) {
      console.error(err);
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || errorData?.error || "Xác thực mã OTP thất bại. Vui lòng kiểm tra lại.";
      setOtpError(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    try {
      await authService.resendVerification(email);
      alert("Đã gửi lại mã OTP mới đến email của bạn.");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Không thể gửi lại mã OTP.");
    }
  };

  if (isSuccess) {
    if (otpSuccess) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center"
        >
          <div className="w-[60px] h-[60px] rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-[28px] font-bold text-[#1f2937] mb-3 tracking-tight">Kích hoạt thành công!</h1>
          <p className="text-[#6b7280] mb-8 text-[15px] leading-relaxed">
            Tài khoản của bạn đã được kích hoạt thành công. Hãy quay lại đăng nhập để bắt đầu.
          </p>
          <Link 
            href="/login" 
            className="w-full h-[54px] rounded-[18px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[15px] font-bold flex items-center justify-center shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Đăng nhập ngay
          </Link>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center"
      >
        <div className="w-[60px] h-[60px] rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-inner">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-[28px] font-bold text-[#1f2937] mb-3 tracking-tight">Nhập mã xác minh</h1>
        <p className="text-[#6b7280] mb-8 text-[15px] leading-relaxed">
          Chúng tôi đã gửi mã xác minh 6 chữ số đến <span className="font-semibold text-gray-800">{email}</span>.
        </p>

        {otpError && (
          <div className="w-full p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100">
            {otpError}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="w-full space-y-5">
          <input 
            type="text"
            required
            maxLength={6}
            placeholder="123456"
            className="w-full h-[50px] text-center tracking-[0.5em] text-2xl font-bold rounded-[16px] bg-[#f3f4f6] border-none focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-base placeholder:text-[#9ca3af]"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          <button 
            disabled={otpLoading}
            className="w-full h-[54px] rounded-[18px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
          >
            {otpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác minh tài khoản"}
          </button>
        </form>

        <button 
          onClick={handleResendOtp}
          className="mt-6 text-sm font-bold text-[#4f6d7a] hover:underline"
        >
          Gửi lại mã OTP
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[440px] p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center"
    >
      <h1 className="text-[32px] font-bold text-[#1f2937] mb-2 tracking-tight">Join the Atelier</h1>
      <p className="text-[#6b7280] mb-8 text-center text-[15px]">Elevate your digital presence within our curated space.</p>

      {/* Role Switcher */}
      <div className="w-full h-[54px] bg-[#f3f4f6] rounded-[18px] p-1.5 flex mb-8">
        <button 
          type="button"
          className={`flex-1 rounded-[14px] text-[13px] font-bold transition-all ${role === "CUSTOMER" ? "bg-white text-[#1f2937] shadow-sm" : "text-[#6b7280] hover:text-[#1f2937]"}`}
          onClick={() => setRole("CUSTOMER")}
        >
          Customer
        </button>
        <button 
          type="button"
          className={`flex-1 rounded-[14px] text-[13px] font-bold transition-all ${role === "DESIGNER" ? "bg-white text-[#1f2937] shadow-sm" : "text-[#6b7280] hover:text-[#1f2937]"}`}
          onClick={() => setRole("DESIGNER")}
        >
          Editor/Designer
        </button>
      </div>

      {error && (
        <div className="w-full p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af]" />
            <input 
              type="text"
              required
              placeholder="Julian Vane"
              className="w-full h-[50px] pl-12 pr-4 rounded-[16px] bg-[#f3f4f6] border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af]" />
            <input 
              type="email"
              required
              placeholder="julian@aura.design"
              className="w-full h-[50px] pl-12 pr-4 rounded-[16px] bg-[#f3f4f6] border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#9ca3af]" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full h-[50px] pl-10 pr-3 rounded-[16px] bg-[#f3f4f6] border-none text-[14px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">Confirm</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#9ca3af]" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full h-[50px] pl-10 pr-3 rounded-[16px] bg-[#f3f4f6] border-none text-[14px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full h-[54px] rounded-[18px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[15px] font-bold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
        </button>
      </form>

      <div className="w-full flex items-center gap-4 my-8">
        <div className="h-[1px] flex-1 bg-gray-100"></div>
        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#d1d5db]">Or continue with</span>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center gap-2.5 h-[50px] rounded-[16px] border border-gray-100 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all text-[13px] font-bold text-[#374151]"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-[18px] h-[18px]" alt="Google" />
          Google
        </button>
        <button 
          onClick={() => handleSocialLogin('facebook')}
          className="flex items-center justify-center gap-2.5 h-[50px] rounded-[16px] border border-gray-100 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all text-[13px] font-bold text-[#374151]"
        >
          <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-[18px] h-[18px]" alt="Facebook" />
          Facebook
        </button>
      </div>

      <p className="mt-10 text-center text-[14px] text-[#6b7280]">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#4f6d7a] hover:underline underline-offset-4 decoration-2">
          Login
        </Link>
      </p>
    </motion.div>
  );
}
