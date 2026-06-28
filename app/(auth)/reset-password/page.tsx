import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const ResetPasswordContent = dynamic(() => import("@/components/auth/ResetPasswordContent"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-10 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-[#6b5b95] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-50 rounded-full blur-[120px] opacity-60" />
      
      <Suspense fallback={
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-10 flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-[#6b5b95] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 tracking-widest hidden sm:flex">
        <span>© 2024 Aura Marketplace. Premium European SaaS.</span>
        <div className="flex gap-6">
          <button className="hover:text-gray-600 transition-colors">Privacy Policy</button>
          <button className="hover:text-gray-600 transition-colors">Terms of Service</button>
          <button className="hover:text-gray-600 transition-colors">Help Center</button>
        </div>
      </div>
    </div>
  );
}
