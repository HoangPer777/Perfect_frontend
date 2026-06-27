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