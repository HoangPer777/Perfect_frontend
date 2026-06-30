'use client';

import React, { useState, useEffect } from 'react';
import { taskService } from "@/services/order/task.service";
import { 
    Search, 
    Eye, 
    Play, 
    CheckCircle2, 
    X, 
    Calendar, 
    DollarSign, 
    AlertCircle, 
    Filter, 
    Loader2,
    Clock,
    User
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Task {
    id: string;
    customer: {
        id: string;
        fullName: string;
        email: string;
    } | null;
    servicePackage: {
        id: string;
        title: string;
        price: number;
    } | null;
    title: string;
    briefText: string;
    status: string; // PENDING, PROCESSING, REVIEWING, COMPLETED, DISPUTED, CANCELLED
    actualPrice: number;
    revisionsLeft: number;
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
}

export default function OrdersManagement() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getDesignerTasks();
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);
            toast.error("Không thể tải danh sách đơn hàng.");
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleUpdateStatus = async (taskId: string, newStatus: string) => {
        try {
            setActionLoadingId(taskId);
            await taskService.updateTaskStatus(taskId, newStatus);
            toast.success(newStatus === 'PROCESSING' ? "Đã nhận đơn hàng thành công!" : "Đã giao sản phẩm hoàn thành!");
            // Refresh list
            await fetchTasks();
            // Update selected task detail view if open
            if (selectedTask && selectedTask.id === taskId) {
                const updated = tasks.find(t => t.id === taskId);
                if (updated) {
                    setSelectedTask({ ...updated, status: newStatus });
                }
            }
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            toast.error("Không thể cập nhật trạng thái đơn hàng.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-amber-50 text-amber-600 border border-amber-100';
            case 'PROCESSING':
                return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
            case 'REVIEWING':
                return 'bg-purple-50 text-purple-600 border border-purple-100';
            case 'COMPLETED':
                return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
            case 'CANCELLED':
            case 'DISPUTED':
                return 'bg-rose-50 text-rose-600 border border-rose-100';
            default:
                return 'bg-gray-50 text-gray-600 border border-gray-100';
        }
    };

    const filteredTasks = (tasks || []).filter(task => {
        if (!task) return false;
        const matchesSearch = 
            (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.customer?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.customer?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount: any) => {
        const val = Number(amount);
        if (isNaN(val)) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatDate = (dateStr: any) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && tasks.length === 0) {
        return (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                <p className="text-gray-500 font-medium">Đang tải danh sách đơn hàng của bạn...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề, tên khách hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all duration-200 text-sm"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="text-gray-400" size={18} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 rounded-2xl border border-gray-100 bg-slate-50/50 outline-none text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ nhận đơn (PENDING)</option>
                        <option value="PROCESSING">Đang thực hiện (PROCESSING)</option>
                        <option value="COMPLETED">Đã hoàn thành (COMPLETED)</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-gray-100">
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Khách hàng</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Tiêu đề yêu cầu</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Dịch vụ</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Doanh thu</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                                        Không tìm thấy đơn hàng nào phù hợp với bộ lọc của bạn.
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{task.customer?.fullName || 'Khách hàng ẩn danh'}</p>
                                                    <p className="text-xs text-gray-400">{task.customer?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{task.title}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                                                <Calendar size={12} />
                                                {formatDate(task.createdAt)}
                                            </p>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-sm font-semibold text-gray-600">
                                                {task.servicePackage?.title || 'Dịch vụ thiết kế'}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-sm font-black text-indigo-600">
                                                {formatCurrency(task.actualPrice)}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedTask(task)}
                                                    className="p-2.5 rounded-xl border border-gray-100 hover:border-indigo-600 hover:text-indigo-600 text-gray-400 bg-white transition-all duration-200"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {task.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(task.id, 'PROCESSING')}
                                                        disabled={actionLoadingId === task.id}
                                                        className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0f172a] text-white hover:opacity-90 flex items-center gap-1.5 transition-all"
                                                    >
                                                        {actionLoadingId === task.id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <Play size={12} />
                                                        )}
                                                        Nhận Đơn
                                                    </button>
                                                )}

                                                {task.status === 'PROCESSING' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(task.id, 'COMPLETED')}
                                                        disabled={actionLoadingId === task.id}
                                                        className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 transition-all"
                                                    >
                                                        {actionLoadingId === task.id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 size={12} />
                                                        )}
                                                        Giao Hàng
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Task Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center bg-slate-50 px-8 py-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">Chi tiết yêu cầu thiết kế</h3>
                                <p className="text-xs text-gray-400 mt-1">ID: {selectedTask.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                            {/* Title & Status */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                                <div>
                                    <h4 className="text-base font-extrabold text-slate-900">{selectedTask.title}</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                                        {selectedTask.servicePackage?.title || 'Dịch vụ thiết kế'}
                                    </p>
                                </div>
                                <span className={`self-start sm:self-center inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black ${getStatusStyle(selectedTask.status)}`}>
                                    {selectedTask.status}
                                </span>
                            </div>

                            {/* Client & Pricing Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-slate-100 p-5 rounded-2xl space-y-3">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Khách hàng</h5>
                                    <div>
                                        <p className="text-sm font-extrabold text-slate-800">{selectedTask.customer?.fullName || 'N/A'}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{selectedTask.customer?.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="border border-slate-100 p-5 rounded-2xl space-y-3">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông tin tài chính</h5>
                                    <div>
                                        <p className="text-sm font-extrabold text-indigo-600 flex items-center gap-1">
                                            <DollarSign size={14} />
                                            {selectedTask.actualPrice} USD
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">Số lần sửa đổi còn lại: {selectedTask.revisionsLeft}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dates details */}
                            <div className="border border-slate-100 p-5 rounded-2xl space-y-3">
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mốc thời gian</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                    <div>
                                        <p className="text-slate-400">Ngày đặt hàng:</p>
                                        <p className="font-semibold text-slate-800 mt-1">{formatDate(selectedTask.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Bắt đầu thực hiện:</p>
                                        <p className="font-semibold text-slate-800 mt-1">{formatDate(selectedTask.startedAt || '')}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400">Hoàn thành lúc:</p>
                                        <p className="font-semibold text-slate-800 mt-1">{formatDate(selectedTask.completedAt || '')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Brief Text */}
                            <div className="border border-slate-100 p-5 rounded-2xl space-y-3 bg-slate-50/50">
                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <AlertCircle size={14} />
                                    Yêu cầu từ khách hàng
                                </h5>
                                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                    {selectedTask.briefText || 'Không có mô tả chi tiết kèm theo.'}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedTask(null)}
                                className="px-5 py-2.5 text-sm font-semibold rounded-2xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Đóng lại
                            </button>

                            {selectedTask.status === 'PENDING' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedTask.id, 'PROCESSING')}
                                    disabled={actionLoadingId === selectedTask.id}
                                    className="px-5 py-2.5 text-sm font-bold rounded-2xl bg-[#0f172a] text-white hover:opacity-90 flex items-center gap-1.5 transition-all"
                                >
                                    {actionLoadingId === selectedTask.id ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Play size={14} />
                                    )}
                                    Nhận Đơn Hàng
                                </button>
                            )}

                            {selectedTask.status === 'PROCESSING' && (
                                <button
                                    onClick={() => handleUpdateStatus(selectedTask.id, 'COMPLETED')}
                                    disabled={actionLoadingId === selectedTask.id}
                                    className="px-5 py-2.5 text-sm font-bold rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 transition-all"
                                >
                                    {actionLoadingId === selectedTask.id ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <CheckCircle2 size={14} />
                                    )}
                                    Giao Hàng Hoàn Tất
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
