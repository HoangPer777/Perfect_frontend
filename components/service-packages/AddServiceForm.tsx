"use client";

import React, { useEffect, useState } from "react";
import { useServiceFormStore } from "@/store/addServiceStore";
import { servicePackageService } from "@/services/service-package/service-package.service";
import { X, Loader2 } from "lucide-react";

interface AddServiceFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddServiceForm({ onClose, onSuccess }: AddServiceFormProps) {
    const {
        title,
        description,
        packageType,
        price,
        deliveryDays,
        revisionsLimit,
        setField,
        resetForm,
    } = useServiceFormStore();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !description) {
            setError("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        if (price < 0) {
            setError("Giá phải lớn hơn 0");
            return;
        }

        if (deliveryDays < 1) {
            setError("Số ngày giao hàng phải lớn hơn 0");
            return;
        }

        if (revisionsLimit < 1) {
            setError("Số lần chỉnh sửa phải lớn hơn 0");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await servicePackageService.createServicePackage({
                title,
                description,
                packageType: packageType as 'BASIC' | 'PRO' | 'VIP' | 'CUSTOM',
                price: Number(price),
                deliveryDays: Number(deliveryDays),
                revisionsLimit: Number(revisionsLimit),
            });

            resetForm();
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Lỗi khi tạo gói dịch vụ");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Thêm gói dịch vụ</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tên gói dịch vụ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setField("title", e.target.value)}
                            placeholder="Ví dụ: Gói cơ bản (Basic)"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setField("description", e.target.value)}
                            placeholder="Mô tả chi tiết gói dịch vụ..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition resize-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Package Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Loại gói
                            </label>
                            <select
                                value={packageType}
                                onChange={(e) => setField("packageType", e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                            >
                                <option value="BASIC">Basic</option>
                                <option value="PRO">Pro</option>
                                <option value="VIP">VIP</option>
                                <option value="CUSTOM">Custom</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Giá (USD) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setField("price", Number(e.target.value))}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Delivery Days */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Số ngày giao hàng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={deliveryDays}
                                onChange={(e) => setField("deliveryDays", Number(e.target.value))}
                                placeholder="1"
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                                required
                            />
                        </div>

                        {/* Revisions Limit */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Số lần chỉnh sửa <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={revisionsLimit}
                                onChange={(e) => setField("revisionsLimit", Number(e.target.value))}
                                placeholder="1"
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 size={18} className="animate-spin" />}
                            {submitting ? "Đang lưu..." : "Thêm gói dịch vụ"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
