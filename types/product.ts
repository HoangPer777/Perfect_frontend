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
    thumbnailUrl: string;
    viewCount: number;
    soldCount: number;
    ratingAvg: number;
    images: {
        id: string;
        url: string;
    }[]
    createdAt: string;
    updatedAt: string;
}