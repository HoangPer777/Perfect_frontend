import {PageResponse} from "@/types/common/page";
import {SnapshotUserResponse} from "@/types/admin";
import api from "@/lib/api";

export const adminService = {
    getUserList: async (): Promise<PageResponse<SnapshotUserResponse>> => {
        const res = await api.get(`/admin/user-list`);
        return res.data;
    }
}