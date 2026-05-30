"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing or invalid. Please check your email link again.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword({ token, newPassword: password });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Reset Password Error:", err.response?.data || err.message);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to reset password. The link might have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 aura-glass rounded-[2rem] flex flex-col items-center border border-red-100"
      >
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6">
          <ShieldAlert className="text-red-500 w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
        <p className="text-gray-500 mb-8 text-center text-sm px-4">
          This password reset link is invalid or has expired. Please request a new link from the forgot password screen.
        </p>
        <Link href="/forgot-password" className="w-full h-12 rounded-xl bg-[#4f6d7a] hover:bg-[#3f5761] text-white font-bold flex items-center justify-center transition-colors">
          Request New Link
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 aura-glass rounded-[2rem] flex flex-col items-center"
    >
      {success ? (
        <div className="text-center w-full py-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 mx-auto">
            <CheckCircle2 className="text-green-500 w-10 h-10 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Successful!</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Your password has been successfully updated. We are redirecting you to the login screen in a few seconds...
          </p>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] rounded-full animate-[progress_3s_ease-out]" style={{ width: '100%' }} />
          </div>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 rounded-xl bg-[#6b5b95]/10 flex items-center justify-center mb-6">
            <Lock className="text-[#6b5b95] w-6 h-6" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Reset password</h1>
          <p className="text-gray-500 mb-8 text-center text-sm px-4">
            Create a secure new password for your account to regain access.
          </p>

          {error && (
            <div className="w-full p-3 mb-6 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  className="w-full h-12 pl-11 pr-11 rounded-xl aura-input text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 ml-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-xl aura-input text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full h-12 rounded-xl aura-btn-gradient text-white font-bold flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Password & Login →"}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}
