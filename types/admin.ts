export interface Role {
    id: number;     
    name: 'ROLE_ADMIN' | 'ROLE_USER' | 'ROLE_DESIGNER' | string;   
}

export interface SnapshotUserResponse {
    id: string;     
    fullName: string;
    email: string;
    username: string;
    avatarUrl: string;
    status: string;
    roles: Role[];     
    createdAt: string;  
}

export interface UserInfoResponse {
    id: string; 
    email: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
    roles: Role[]; 
    city: string | null;
    detailedAddress: string | null;
    specialization: string | null;
    bio: string | null;
    portfolioUrl: string | null;
    skills: string | null;
    experienceYears: number;
    status: "ACTIVE" | "INACTIVE" | "BANNED" | string; 
    isVerified: boolean;
    createdAt: string; 
}