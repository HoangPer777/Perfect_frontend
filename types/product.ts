export interface AddProductRequest {
    id?: string;
    title: string;
    description: string;
    price: number;
    thumbnailUrl: string;
    status: string;
    images: string[];
    categories: string[];
}

export interface CardProductResponse {
    id: string;
    title: string;
    price: number;
    thumbnailUrl: string;
    ratingAvg: number;
    soldCount: number;
    avatarUrlDesigner: string;
    designerId: string
    usernameDesigner: string;
}

export interface ProductResponse {
    id: string;
    designer: {
        id: string;
        email: string;
        username: string;
        avatarUrl: string;
    }
    title: string;
    description: string;
    price: number;
    thumbnailUrl: string;
    viewCount: number;
    soldCount: number;
    ratingAvg: number;
    images: {
        id: string;
        url: string;
    }[];
    categories: {
        id: string;
        name: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface AddProductResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnailUrl: string;
    status: string;
    viewCount: number;
    soldCount: number;
    ratingAvg: number;
    images: {
        id: string;
        url: string;
    }[];
    categories: {
        id: string;
        name: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface SnapshotProductResponse {
    id: string;
    title: string;
    thumbnailUrl: string;
    status: string;
    viewCount: number;
    soldCount: number;
    createdAt: string | Date; 
}
export type PackageType = "BASIC" | "PRO" | "VIP" | "CUSTOM" | string;

export interface ServicePackageResponse {
    id: string;
    title: string;
    description: string;
    packageType: PackageType;
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
    productId: string | null;
    productTitle: string | null;
    designerId: string;
    designerName: string;
    designerAvatar: string | null;
}

export interface DesignerServiceGroupResponse {
    designerId: string;
    designerName: string;
    designerAvatarUrl: string | null;
    packages: ServicePackageResponse[];
}
export interface AdminProductListResponse {
    id: string;
    title: string;
    thumbnailUrl: string;
    designerName: string;
    status: string;
    price: number;
    basic: ServicePackageResponse | null;
    pro: ServicePackageResponse | null;
    vip: ServicePackageResponse | null;
    createdAt: string;
}