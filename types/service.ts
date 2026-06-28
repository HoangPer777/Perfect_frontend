export interface ServicePackageResponse {
    id: string;
    title: string;
    description: string; 
    packageType: 'BASIC' | 'MEDIUM' | 'PREMIUM' | 'PRO_MAX' | 'CUSTOM';
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
    productId?: string;
    productTitle?: string;
    designerId?: string;
    designerName?: string;
    designerAvatar?: string;
}

export interface CreateServicePackageRequest {
    productId?: string | null;
    title: string;
    description: string;
    packageType: 'BASIC' | 'MEDIUM' | 'PREMIUM' | 'PRO_MAX' | 'CUSTOM';
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
}

export interface UpdateServicePackageRequest {
    title: string;
    description: string;
    packageType: 'BASIC' | 'MEDIUM' | 'PREMIUM' | 'PRO_MAX' | 'CUSTOM';
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
}