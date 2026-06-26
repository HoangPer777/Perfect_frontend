"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        const errorMsg = err.response?.data?.message || err.message || "Failed to verify email. The link may have expired or is invalid.";
        setMessage(errorMsg);
      }
    };

    verify();
  }, [token]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[440px] p-10 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center z-10"
    >
      {status === "loading" && (
        <>
          <div className="w-[60px] h-[60px] rounded-full bg-slate-50 text-[#6b5b95] flex items-center justify-center mb-6 shadow-inner">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h1 className="text-[28px] font-bold text-[#1f2937] mb-3 tracking-tight">Verifying...</h1>
          <p className="text-[#6b7280] text-[15px] leading-relaxed">{message}</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-[60px] h-[60px] rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h1 className="text-[28px] font-bold text-[#1f2937] mb-3 tracking-tight">Verified!</h1>
          <p className="text-[#6b7280] text-[15px] mb-8 leading-relaxed">{message}</p>
          <Link 
            href="/login" 
            className="w-full h-[54px] rounded-[18px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[15px] font-bold flex items-center justify-center shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Log in to your Account
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-[60px] h-[60px] rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 shadow-inner">
            <XCircle className="w-6 h-6" />
          </div>
          <h1 className="text-[28px] font-bold text-[#1f2937] mb-3 tracking-tight">Verification Failed</h1>
          <p className="text-[#6b7280] text-[15px] mb-8 leading-relaxed">{message}</p>
          <Link 
            href="/login" 
            className="w-full h-[54px] rounded-[18px] bg-gradient-to-r from-[#4f6d7a] to-[#6b5b95] text-white text-[15px] font-bold flex items-center justify-center shadow-lg shadow-[#6b5b95]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Back to Login
          </Link>
        </>
      )}
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
      
      <Suspense fallback={
        <div className="bg-white rounded-[2.5rem] shadow-xl w-full max-w-[440px] p-10 flex items-center justify-center min-h-[300px] z-10 border border-gray-50">
          <Loader2 className="w-8 h-8 text-[#6b5b95] animate-spin" />
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 tracking-widest hidden sm:flex">
        <span>© 2024 Perfect Market. All rights reserved.</span>
        <div className="flex gap-6">
          <button className="hover:text-gray-600 transition-colors">Privacy Policy</button>
          <button className="hover:text-gray-600 transition-colors">Terms of Service</button>
          <button className="hover:text-gray-600 transition-colors">Help Center</button>
        </div>
      </div>
    </div>
  );
}
