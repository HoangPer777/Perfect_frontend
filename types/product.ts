export interface AddProductRequest {
    title: string;
    description: string;
    thumbnailUrl: string;
    status: string;
    images: string[];
    categories: string[];
}

export interface ProductResponse {}