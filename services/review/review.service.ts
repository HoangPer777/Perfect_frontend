import api from "@/lib/api";

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  content: string;
  reason?: string;
}

export interface ReviewResponse {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  productId: string;
  rating: number;
  content: string;
  reason?: string;
}

export const reviewService = {
  createProductReview: async (data: CreateReviewRequest) => {
    const response = await api.post<ReviewResponse>("/reviews/product", data);
    return response.data;
  },
};
