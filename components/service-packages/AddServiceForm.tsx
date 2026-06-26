"use client";

import React, { useEffect, useState } from "react";
import { useServiceFormStore } from "@/store/addServiceStore";
import { servicePackageService } from "@/services/service-package/service-package.service";
import { X, Loader2, Sparkles, DollarSign, Calendar, RefreshCcw } from "lucide-react";
import { ServicePackageResponse } from "@/types/service";

interface AddServiceFormProps {
    productId: string;
    initialData?: ServicePackageResponse | null; 
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddServiceForm({ productId, initialData, onClose, onSuccess }: AddServiceFormProps) {
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
    const isEditMode = !!initialData;

    useEffect(() => {
        setMounted(true);
        if (initialData) {
            setField("title", initialData.title);
            setField("description", initialData.description);
            setField("packageType", initialData.packageType);
            setField("price", initialData.price);
            setField("deliveryDays", initialData.deliveryDays);
            setField("revisionsLimit", initialData.revisionsLimit);
        } else {
            resetForm();
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const payload = {
                productId,
                title,
                description,
                packageType: packageType as 'BASIC' | 'PRO' | 'VIP' | 'CUSTOM',
                price: Number(price),
                deliveryDays: Number(deliveryDays),
                revisionsLimit: Number(revisionsLimit),
            };

            if (isEditMode && initialData) {
                // Gọi API cập nhật
                await servicePackageService.updateServicePackage(initialData.id, payload);
            } else {
                // Gọi API tạo mới
                await servicePackageService.createServicePackage(payload);
            }

            resetForm();
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="w-full flex flex-col bg-white rounded-3xl max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditMode ? "Update Service Package" : "Add Service Package"}
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {isEditMode ? "Modify your tier package parameters" : "Create a clear pricing tier for clients"}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-full transition"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-sm text-gray-700">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl font-medium text-xs">
                        {error}
                    </div>
                )}

                {/* Package Title */}
                <div className="space-y-2">
                    <label className="block font-semibold text-gray-800">
                        Package Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setField("title", e.target.value)}
                        placeholder="e.g., Premium Logo Design Concept"
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition placeholder-gray-300"
                        required
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="block font-semibold text-gray-800">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setField("description", e.target.value)}
                        placeholder="Detail what is included in this tier package..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition resize-none placeholder-gray-300 leading-relaxed"
                        required
                    />
                </div>

                {/* Tier & Price Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block font-semibold text-gray-800">Tier Type</label>
                        <select
                            value={packageType}
                            onChange={(e) => setField("packageType", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition bg-white"
                        >
                            <option value="BASIC">Basic</option>
                            <option value="PRO">Pro</option>
                            <option value="VIP">VIP</option>
                            <option value="CUSTOM">Custom</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-semibold text-gray-800">
                            Price (USD) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                <DollarSign size={16} />
                            </span>
                            <input
                                type="number"
                                value={price || ""}
                                onChange={(e) => setField("price", Number(e.target.value))}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition placeholder-gray-300"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery & Revisions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block font-semibold text-gray-800">
                            Delivery Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Calendar size={16} />
                            </span>
                            <input
                                type="number"
                                value={deliveryDays || ""}
                                onChange={(e) => setField("deliveryDays", Number(e.target.value))}
                                placeholder="Days to complete"
                                min="1"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition placeholder-gray-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-semibold text-gray-800">
                            Revisions Limit <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <RefreshCcw size={16} />
                            </span>
                            <input
                                type="number"
                                value={revisionsLimit || ""}
                                onChange={(e) => setField("revisionsLimit", Number(e.target.value))}
                                placeholder="Number of iterations"
                                min="1"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition placeholder-gray-300"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="flex gap-3 pt-5 border-t border-gray-100 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-semibold rounded-full hover:bg-gray-50 active:scale-95 transition-all text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 disabled:bg-gray-300 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs shadow-md shadow-purple-100"
                    >
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        {submitting ? "Saving..." : isEditMode ? "Update Package" : "Add Package"}
                    </button>
                </div>
            </form>
        </div>
    );
}