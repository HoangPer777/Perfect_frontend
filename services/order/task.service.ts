import api from "@/lib/api";
import {DesignerChartResponse} from "@/types/chart";

export const taskService = {
    getDesignerChart: async (): Promise<DesignerChartResponse> => {
        const res = await api.get(`/tasks/designer/chart`)
        return res.data
    }
}