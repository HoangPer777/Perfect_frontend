import api from "@/lib/api";
import {DesignerChartResponse} from "@/types/chart";

import {
    AdminTaskDetailResponse,
    AdminTaskListResponse,
} from "@/types/order";


export const taskService = {
    getDesignerChart: async (): Promise<DesignerChartResponse> => {
        const res = await api.get(`/tasks/designer/chart`)
        return res.data
    },
    getDesignerTasks: async (): Promise<any[]> => {
        const res = await api.get(`/tasks/designer`);
        return res.data;
    },
    updateTaskStatus: async (taskId: string, status: string): Promise<any> => {
        const res = await api.patch(`/tasks/${taskId}/status`, null, {
            params: { status }
        });
        return res.data;
    },
    getAdminTasks: async (): Promise<AdminTaskListResponse[]> => {
        const res = await api.get(`/tasks/admin`);
        return res.data;
    },

    getAdminTaskDetail: async (
        taskId: string
    ): Promise<AdminTaskDetailResponse> => {
        const res = await api.get(`/tasks/admin/${taskId}`);
        return res.data;
    },
}
