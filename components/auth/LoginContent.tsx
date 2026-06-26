"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, Grid } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import {cartService} from "@/services/cart/cart.service";
import {useCartStore} from "@/store/cartStore";

export default function LoginContent() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setFieldCart = useCartStore((state) => state.setField);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      
      // Update store
      const user = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        role: response.user.roles[0] as any, // Simplified for now
      };
      setAuth(user, response.accessToken);
      
      const countCartItems = await cartService.countCartItems();
      setFieldCart("cartCount", countCartItems);
      
      router.push("/");
    } catch (err: any) {
      console.error("Login Error:", err.response?.data || err.message);
      const errorData = err.response?.data;
      const errorMessage = errorData?.message || errorData?.error || "Invalid email or password. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || "http://localhost:8080";
    window.location.href = `${backendUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[440px] p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center"
    >
      {/* Grid Icon */}
      <div className="w-[52px] h-[52px] rounded-[14px] bg-[#4f6d7a] flex items-center justify-center mb-8 shadow-sm">
        <Grid className="text-white w-6 h-6" />
      </div>

      <h1 className="text-[32px] font-bold text-[#1f2937] mb-2 tracking-tight">Chào mừng quay lại</h1>
      <p className="text-[#6b7280] mb-10 text-center text-[15px]">Đăng nhập để quản lý dự án và các dịch vụ của bạn.</p>

      {error && (
        <div className="w-full p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

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

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] uppercase tracking-[0.1em] font-bold text-[#9ca3af]">Mật khẩu</label>
            <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-[#6b5b95] hover:opacity-80 transition-opacity">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af]" />
            <input 
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full h-[54px] pl-12 pr-12 rounded-[18px] bg-[#f3f4f6] border-none text-[15px] focus:ring-2 focus:ring-[#6b5b95]/20 focus:bg-white transition-all placeholder:text-[#9ca3af]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full h-[60px] rounded-[20px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[16px] font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đăng nhập →"}
        </button>
      </form>

      <div className="w-full flex items-center gap-4 my-10">
        <div className="h-[1px] flex-1 bg-gray-100"></div>
        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#d1d5db]">Hoặc đăng nhập bằng</span>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <button 
          onClick={() => handleSocialLogin('google')}
          className="flex items-center justify-center gap-2.5 h-[54px] rounded-[18px] border border-gray-100 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all text-[13px] font-bold text-[#374151]"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-[18px] h-[18px]" alt="Google" />
          Google
        </button>
        <button 
          onClick={() => handleSocialLogin('facebook')}
          className="flex items-center justify-center gap-2.5 h-[54px] rounded-[18px] border border-gray-100 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all text-[13px] font-bold text-[#374151]"
        >
          <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-[18px] h-[18px]" alt="Facebook" />
          Facebook
        </button>
      </div>

      <p className="mt-12 text-center text-[14px] text-[#6b7280]">
        Bạn chưa có tài khoản?{" "}
        <Link href="/register" className="font-bold text-[#4f6d7a] hover:underline underline-offset-4 decoration-2">
          Đăng ký ngay
        </Link>
      </p>
    </motion.div>
  );
}
