export interface AddProductRequest {
    title: string;
    description: string;
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
    usernameDesigner: string;
}

export interface ProductResponse {}