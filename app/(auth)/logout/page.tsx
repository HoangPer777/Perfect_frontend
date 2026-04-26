"use client";

import { motion } from "framer-motion";
import { LogOut, Grid } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { useState } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logoutStore();
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-80">
        <span className="text-xl font-bold text-[#4f6d7a]">Aura Marketplace</span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 aura-glass rounded-[2rem] flex flex-col items-center"
      >
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6">
          <LogOut className="text-gray-600 w-6 h-6" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Are you sure you want to log out?</h1>
        <p className="text-gray-500 mb-8 text-center text-sm px-4">
          You can always sign back in to access your curated collection.
        </p>

        <div className="w-full space-y-3">
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="w-full h-12 rounded-xl aura-btn-gradient text-white font-bold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? "Logging out..." : "Log out →"}
          </button>
          <button 
            onClick={() => router.back()}
            className="w-full h-12 rounded-xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-8">
        <div className="flex items-center gap-1.5 opacity-40">
           <div className="w-3 h-3 border-2 border-gray-400 rounded-sm" /> 
           <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Secure Session</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-40">
           <div className="w-3 h-3 border-2 border-gray-400 rounded-full" /> 
           <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600">Identity Protected</span>
        </div>
      </div>
    </div>
  );
}
