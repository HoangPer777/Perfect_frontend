'use client';

import { useEffect, useState } from 'react';
import {
    Bell,
    Moon,
    Search,
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    Settings,
    HelpCircle,
    LogOut,
    Plus,
    Share2,
    Globe,
    Gem,
    Zap,
    Loader2
} from 'lucide-react';
import AddServiceForm from '@/components/service-packages/AddServiceForm';
import DesignerServicesList from '@/components/service-packages/DesignerServicesList';

export default function DesignerPage() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(false);
        } catch (err) {
            setError('Không thể tải dữ liệu');
        }
    };

    const handleAddSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f8] flex">

            {/* CONTENT */}

            <main className="flex-1 px-12 py-8">

                {/* PROFILE */}

                <div className="grid grid-cols-12 gap-6 mt-10">

                    <div className="col-span-8 bg-white rounded-[32px] p-10">

                        <div className="flex gap-8">

                            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                <Zap size={16} />
                            </div>

                            <div>

                                <h2 className="font-bold text-3xl">
                                    Alex Rivera
                                </h2>

                                <p className="text-indigo-600 uppercase font-semibold mt-1">
                                    Senior Product Designer • Lumina Core
                                </p>

                                <p className="mt-5 text-gray-500 leading-8 max-w-xl">
                                    Chuyên gia thiết kế trải nghiệm người dùng với
                                    hơn 8 năm kinh nghiệm kiến tạo các giải pháp
                                    kỹ thuật số tối giản và hiệu quả.
                                </p>

                                <div className="flex gap-3 mt-6">

                                    <div className="bg-gray-100 rounded-full px-5 py-3 flex items-center gap-2">
                                        <Globe size={16} />
                                        alexrivera.design
                                    </div>

                                    <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Share2 size={18} />
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="col-span-4">

                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-[32px] text-white p-8 h-full">

                            <h3 className="font-semibold text-xl">
                                Thông Tin Designer
                            </h3>

                            <p className="mt-3 text-indigo-100">
                                Đang hoạt động tại TP. Hồ Chí Minh
                            </p>

                            <div className="flex justify-between mt-10">

                                <div>
                                    <h2 className="text-3xl font-bold">
                                        120+
                                    </h2>

                                    <p>Dự án hoàn thành</p>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold">
                                        4.9
                                    </h2>

                                    <p>Đánh giá trung bình</p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* TABS */}

                <div className="flex gap-12 mt-12 border-b">

                    <button className="pb-4 text-gray-500">
                        Overview
                    </button>

                    <button className="pb-4 text-gray-500">
                        Portfolio
                    </button>

                    <button className="pb-4 border-b-2 border-indigo-600 text-indigo-600 font-medium">
                        Services
                    </button>

                </div>

                {/* SERVICE HEADER */}

                <div className="flex justify-between items-center mt-10">

                    <div>

                        <h2 className="text-3xl font-bold">
                            Gói dịch vụ
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Quản lý và cập nhật các gói dịch vụ thiết kế của bạn.
                        </p>

                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-indigo-600 text-white px-8 py-4 rounded-full flex items-center gap-2 hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        Thêm gói dịch vụ
                    </button>

                </div>

                {/* SERVICE LIST */}

                <div className="mt-10">
                    <DesignerServicesList
                        onAddClick={() => setShowAddForm(true)}
                        refreshTrigger={refreshTrigger}
                    />
                </div>

            </main>

            {/* Add Service Modal */}
            {showAddForm && (
                <AddServiceForm
                    onClose={() => setShowAddForm(false)}
                    onSuccess={handleAddSuccess}
                />
            )}

        </div>
    );
}

function SidebarItem({
                         title,
                         icon,
                         active = false
                     }: {
    title: string;
    icon: React.ReactNode;
    active?: boolean;
}) {
    return (
        <button
            className={`
                flex
                items-center
                gap-3
                w-full
                px-4
                py-3
                rounded-xl
                transition-all
                ${
                active
                    ? 'bg-white text-indigo-600 font-semibold'
                    : 'text-gray-600 hover:bg-white'
            }
            `}
        >
            {icon}
            {title}
        </button>
    );
}