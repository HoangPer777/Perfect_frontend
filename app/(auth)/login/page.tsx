"use client";

import dynamic from "next/dynamic";

const LoginContent = dynamic(() => import("@/components/auth/LoginContent"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-10 flex items-center justify-center min-h-[500px]">
      <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40" />
      
      <LoginContent />

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 tracking-widest hidden sm:flex">
        <span>© 2024 Perfect Market. All rights reserved.</span>
        <div className="flex gap-6">
          <button className="hover:text-gray-600 transition-colors">Privacy Policy</button>
          <button className="hover:text-gray-600 transition-colors">Terms of Service</button>
          <button className="hover:text-gray-600 transition-colors">Cookie Policy</button>
        </div>
      </div>
    </div>
  );
}
