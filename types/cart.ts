export interface CartItemResponse {
    id: string;
    product: {
        id: string;
        designerUsername: string;
        title: string;
        thumbnailUrl: string;
    };
    serviceId: string;
    title: string;
    packageType: 'BASIC' | 'PRO' | 'VIP' | 'CUSTOM';
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
}

