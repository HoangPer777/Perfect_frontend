import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  username: string;
  role: "CUSTOMER" | "DESIGNER" | "ADMIN" | "ROLE_CUSTOMER" | "ROLE_DESIGNER" | "ROLE_ADMIN";
  fullName?: string;
  avatarUrl?: string;
  city?: string;
  detailedAddress?: string;
  emailNotifications?: boolean;
  promotionalOffers?: boolean;
  provider?: "LOCAL" | "GOOGLE" | "FACEBOOK";
  specialization?: string;
  bio?: string;
  portfolioUrl?: string;
  skills?: string;
  experienceYears?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);
