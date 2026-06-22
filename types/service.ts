export interface ServicePackageResponse {
    id: string;
    title: string;
    description: string; 
    packageType: string;
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
}

export interface CreateServicePackageRequest {
    title: string;
    description: string;
    packageType: 'BASIC' | 'PRO' | 'VIP' | 'CUSTOM';
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
}

export interface UpdateServicePackageRequest {
    title: string;
    description: string;
    packageType: 'BASIC' | 'PRO' | 'VIP' | 'CUSTOM';
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
}