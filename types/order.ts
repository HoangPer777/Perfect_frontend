export interface AdminTaskListResponse {
    id: string;
    customerName: string;
    designerName: string | null;
    serviceName: string;
    title: string;
    status: string;
    actualPrice: number;
    createdAt: string;
}

export interface AdminTaskDetailResponse {
    id: string;
    customerName: string;
    customerEmail: string;
    designerName: string | null;
    serviceName: string;
    title: string;
    briefText: string;
    status: string;
    actualPrice: number;
    revisionsLeft: number;
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
}