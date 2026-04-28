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
  return <LoginContent />;
}
