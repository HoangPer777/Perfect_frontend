"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form states
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể gửi mã yêu cầu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setResetError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setResetLoading(true);
    setResetError(null);
    try {
      await authService.resetPassword({ token: code, newPassword });
      setResetSuccess(true);
    } catch (err: any) {
      console.error(err);
      setResetError(err.response?.data?.message || "Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã OTP.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[440px] p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center"
    >
      <div className="w-[52px] h-[52px] rounded-[14px] bg-[#4f6d7a]/10 flex items-center justify-center mb-8 shadow-sm">
        <RotateCcw className="text-[#4f6d7a] w-6 h-6" />
      </div>

      <h1 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight text-center">
        {resetSuccess ? "Thành công!" : success ? "Đặt lại mật khẩu" : "Quên mật khẩu?"}
      </h1>
      
      <p className="text-gray-500 mb-8 text-center text-[14px] px-4 leading-relaxed">
        {resetSuccess 
          ? "Mật khẩu của bạn đã được cập nhật thành công."
          : success 
          ? `Chúng tôi đã gửi mã khôi phục mật khẩu gồm 6 chữ số tới ${email}.` 
          : "Nhập email của bạn để nhận mã khôi phục mật khẩu từ hệ thống."}
      </p>

      {error && (
        <div className="w-full p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {resetError && (
        <div className="w-full p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100">
          {resetError}
        </div>
      )}

      {resetSuccess ? (
        <Link 
          href="/login" 
          className="w-full h-[54px] rounded-[18px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[15px] font-bold flex items-center justify-center shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Đăng nhập ngay
        </Link>
      ) : success ? (
        <form onSubmit={handleResetSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">Mã xác minh (OTP)</label>
            <input 
              type="text"
              required
              maxLength={6}
              placeholder="123456"
              className="w-full h-[50px] text-center tracking-[0.5em] text-2xl font-bold rounded-[16px] bg-[#f3f4f6] border-none focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-base placeholder:text-[#9ca3af]"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">Mật khẩu mới</label>
            <input 
              type="password"
              required
              placeholder="••••••••"
              className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6] border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">Xác nhận mật khẩu mới</label>
            <input 
              type="password"
              required
              placeholder="••••••••"
              className="w-full h-[50px] px-4 rounded-[16px] bg-[#f3f4f6] border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={resetLoading}
            className="w-full h-[54px] rounded-[18px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
          >
            {resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đặt lại mật khẩu"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af] ml-1">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af]" />
              <input 
                type="email"
                required
                placeholder="name@example.com"
                className="w-full h-[54px] pl-12 pr-4 rounded-[18px] bg-[#f3f4f6] border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full h-[54px] rounded-[18px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi mã xác nhận"}
          </button>
        </form>
      )}

      {(!success || resetError) && (
        <Link 
          href="/login" 
          className="mt-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Đăng nhập
        </Link>
      )}
    </motion.div>
  );
}
