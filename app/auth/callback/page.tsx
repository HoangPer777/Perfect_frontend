"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const fetchUserAndRedirect = async (token: string) => {
      try {
        // 1. Set token first so the getMe() call can use it via interceptor
        setAuth({ id: "", email: "", username: "Logging in...", role: "CUSTOMER" }, token);
        
        // 2. Fetch real user info from backend
        const response = await authService.getMe();
        
        // 3. Update store with full user data
        const user = {
          id: response.id,
          email: response.email,
          username: response.username,
          role: response.roles[0] as any,
        };
        setAuth(user, token);
        
        router.push("/");
      } catch (err) {
        console.error("Failed to fetch user after social login:", err);
        router.push("/login?error=user_fetch_failed");
      }
    };

    const token = searchParams.get("token");
    if (token) {
      fetchUserAndRedirect(token);
    } else {
      router.push("/login?error=social_auth_failed");
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb]">
      <Loader2 className="w-10 h-10 animate-spin text-[#6b5b95] mb-4" />
      <h2 className="text-xl font-medium text-gray-600">Authenticating with Aura...</h2>
      <p className="text-gray-400 text-sm mt-2">Please wait while we set up your session.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
