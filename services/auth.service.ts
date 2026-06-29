import api from "@/lib/api";
import {PageResponse} from "@/types/common/page";
import {Role, SnapshotUserResponse, UserInfoResponse} from "@/types/admin";

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
    city?: string;
    detailedAddress?: string;
    emailNotifications?: boolean;
    promotionalOffers?: boolean;
    provider?: string;
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

  verifyEmail: async (token: string, email?: string) => {
    const response = await api.post("/auth/verify-email", { token, email });
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
  },

  updateProfile: async (data: {
    fullName: string;
    username: string;
    avatarUrl: string;
    city?: string;
    detailedAddress?: string;
    emailNotifications?: boolean;
    promotionalOffers?: boolean;
  }) => {
    const response = await api.patch<AuthResponse["user"]>("/auth/profile", data);
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await api.post("/auth/change-password", data);
    return response.data;
  },

  upgradeToDesigner: async (data: {
    specialization: string;
    bio: string;
    portfolioUrl: string;
    skills: string;
    experienceYears: number;
  }) => {
    const response = await api.post("/auth/upgrade-designer", data);
    return response.data;
  },

  getPurchasedTasks: async () => {
    const response = await api.get("/tasks/customer");
    return response.data;
  },
  getAdminUsers: async (params: { role?: string; username?: string; page: number; size: number }) => {
    const response = await api.get<PageResponse<SnapshotUserResponse>>(
        "/admin/users/get-user-list",
        {
          params: {
            role: params.role === "ALL" ? undefined : params.role,
            username: params.username || undefined,
            page: params.page - 1,
            size: params.size,
          },
        }
    );
    return response.data;
  },
  getAdminUserInfo: async (id: string): Promise<UserInfoResponse> => {
    const response = await api.get("/admin/users/user-info", {
      params: {
        id: id,
      }
    })
    return response.data
  },
  getAllRoles: async (): Promise<Role[]> => {
    const response = await api.get("/admin/users/get-roles")
    return response.data;
  },
  updateUserRole: async (request: {userId: string, roleId: number}): Promise<boolean> => {
    const res = await api.put(`/admin/users/update-role`, request);
    return res.data
  },
  updateUserStatus: async (request: {userId: string, status: string}): Promise<boolean> => {
    const res = await api.put(`/admin/users/update-status`, request);
    return res.data
  }
};
