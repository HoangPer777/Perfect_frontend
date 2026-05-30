import api from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    username: string;
    avatarUrl: string;
    roles: string[];
  };
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
  
  resetPassword: async (data: { token: string; newPassword: string }) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },
};
