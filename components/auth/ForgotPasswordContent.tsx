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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 aura-glass rounded-[2rem] flex flex-col items-center"
    >
      <div className="w-12 h-12 rounded-xl bg-[#4f6d7a]/20 flex items-center justify-center mb-6">
        <RotateCcw className="text-[#4f6d7a] w-6 h-6" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
      <p className="text-gray-500 mb-8 text-center text-sm px-4">
        {success 
          ? "Check your inbox! We've sent a recovery link to your email." 
          : "Enter your email and we'll send you a reset link to regain access to your account."}
      </p>

      {error && (
        <div className="w-full p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {success ? (
        <Link href="/login" className="w-full h-12 rounded-xl aura-btn-gradient text-white font-bold flex items-center justify-center gap-2">
          Back to Login
        </Link>
      ) : (
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-500 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="email"
                required
                placeholder="name@company.com"
                className="w-full h-12 pl-11 pr-4 rounded-xl aura-input text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full h-12 rounded-xl aura-btn-gradient text-white font-bold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link →"}
          </button>
        </form>
      )}

      {!success && (
        <Link href="/login" className="mt-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      )}
    </motion.div>
  );
}
