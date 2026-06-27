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