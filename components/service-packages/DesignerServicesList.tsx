"use client";

import React, { useEffect, useState } from "react";
import { ServicePackageResponse } from "@/types/service";
import { servicePackageService } from "@/services/service-package/service-package.service";
import { Pen, Trash2, Loader2, AlertCircle } from "lucide-react";

interface DesignerServicesListProps {
    onAddClick: () => void;
    refreshTrigger?: number;
}

export default function DesignerServicesList({ onAddClick, refreshTrigger = 0 }: DesignerServicesListProps) {
    const [services, setServices] = useState<ServicePackageResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadServices();
    }, [refreshTrigger]);

    const loadServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await servicePackageService.getMyPackages();
            setServices(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Không thể tải danh sách gói dịch vụ");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa gói dịch vụ này?")) return;

        try {
            setDeleting(id);
            await servicePackageService.deleteServicePackage(id);
            setServices(services.filter(s => s.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.message || "Lỗi khi xóa gói dịch vụ");
            console.error(err);
        } finally {
            setDeleting(null);
        }
    };

    const getPackageColor = (packageType: string) => {
        const type = packageType?.toUpperCase();
        switch (type) {
            case "BASIC":
                return "bg-blue-50 border-blue-200";
            case "PRO":
                return "bg-purple-50 border-purple-200";
            case "VIP":
                return "bg-amber-50 border-amber-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const getPackageBadgeColor = (packageType: string) => {
        const type = packageType?.toUpperCase();
        switch (type) {
            case "BASIC":
                return "bg-blue-100 text-blue-700";
            case "PRO":
                return "bg-purple-100 text-purple-700";
            case "VIP":
                return "bg-amber-100 text-amber-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {services.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 mb-4">Bạn chưa có gói dịch vụ nào</p>
                    <button
                        onClick={onAddClick}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        <span>+</span> Thêm gói dịch vụ
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`rounded-2xl p-6 border transition-all duration-300 ${getPackageColor(
                                service.packageType
                            )} hover:shadow-lg`}
                        >
                            {/* Header with Title and Badge */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {service.title}
                                    </h3>
                                    <span
                                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getPackageBadgeColor(
                                            service.packageType
                                        )}`}
                                    >
                                        {service.packageType}
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-3xl font-black text-indigo-600 my-4">
                                ${Number(service.price).toFixed(2)}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {service.description}
                            </p>

                            {/* Details */}
                            <div className="space-y-2 mb-6 text-sm text-gray-700">
                                <div className="flex items-center justify-between">
                                    <span>Thời gian giao:</span>
                                    <span className="font-semibold">{service.deliveryDays} ngày</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Số lần chỉnh sửa:</span>
                                    <span className="font-semibold">
                                        {service.revisionsLimit} {service.revisionsLimit > 1 ? "lần" : "lần"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-white transition">
                                    <Pen size={16} />
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    disabled={deleting === service.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 disabled:bg-gray-200 disabled:text-gray-500 transition"
                                >
                                    {deleting === service.id ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} />
                                            Xóa
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Service Card */}
                    <button
                        onClick={onAddClick}
                        className="rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 flex flex-col items-center justify-center gap-3 text-center"
                    >
                        <div className="text-4xl text-gray-400 hover:text-indigo-600">+</div>
                        <div>
                            <p className="font-semibold text-gray-700">Thêm gói dịch vụ</p>
                            <p className="text-sm text-gray-500">Tạo gói dịch vụ mới</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
