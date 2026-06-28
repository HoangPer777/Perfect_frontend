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
