"use client";

import React, { useEffect, useState } from "react";
import { ServicePackageResponse } from "@/types/service";
import { servicePackageService } from "@/services/service-package/service-package.service";
import { Pen, Trash2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import AddServiceForm from "./AddServiceForm"; // Import form đa năng vào đây

interface DesignerServicesListProps {
    productId: string;
    onAddClick: () => void;
    refreshTrigger?: number;
}

export default function DesignerServicesList({ productId, onAddClick, refreshTrigger = 0 }: DesignerServicesListProps) {
    const [services, setServices] = useState<ServicePackageResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const [editingPackage, setEditingPackage] = useState<ServicePackageResponse | null>(null);

    useEffect(() => {
        loadServices();
    }, [refreshTrigger]);

    const loadServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await servicePackageService.getMyPackages(productId);
            setServices(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load service packages list.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service package?")) return;

        try {
            setDeleting(id);
            await servicePackageService.deleteServicePackage(id);
            setServices(services.filter(s => s.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete the package.");
            console.error(err);
        } finally {
            setDeleting(null);
        }
    };

    const getPackageColor = (packageType: string) => {
        const type = packageType?.toUpperCase();
        switch (type) {
            case "BASIC":
                return "bg-slate-50 border-slate-200";
            case "PRO":
                return "bg-purple-50 border-purple-200";
            case "VIP":
                return "bg-amber-50 border-amber-200";
            default:
                return "bg-purple-50 border-purple-200";
        }
    };

    const getPackageBadgeColor = (packageType: string) => {
        const type = packageType?.toUpperCase();
        switch (type) {
            case "BASIC":
                return "bg-slate-100 text-slate-700";
            case "PRO":
                return "bg-purple-100 text-purple-700";
            case "VIP":
                return "bg-amber-100 text-amber-700";
            default:
                return "bg-purple-100 text-purple-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-xs font-medium">{error}</p>
                </div>
            )}

            {services.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-gray-200 border-dashed">
                    <p className="text-gray-500 mb-4 text-sm">You haven't configured any tier packages for this product yet.</p>
                    <button
                        onClick={onAddClick}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-700 transition shadow-sm shadow-purple-100"
                    >
                        + Create Package
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${getPackageColor(
                                service.packageType
                            )} hover:shadow-xl`}
                        >
                            <div>
                                {/* Header with Title and Badge */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 capitalize">
                                            {service.title}
                                        </h3>
                                        <span
                                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getPackageBadgeColor(
                                                service.packageType
                                            )}`}
                                        >
                                            {service.packageType}
                                        </span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="text-3xl font-black text-purple-700 my-4">
                                    ${Number(service.price).toFixed(2)}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                                    {service.description}
                                </p>

                                <hr className="border-black/5 my-4" />

                                {/* Details */}
                                <div className="space-y-2.5 mb-6 text-xs text-gray-600 font-medium">
                                    <div className="flex items-center justify-between">
                                        <span>Delivery Time:</span>
                                        <span className="font-bold text-gray-800">{service.deliveryDays} {service.deliveryDays === 1 ? 'day' : 'days'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Revisions Limit:</span>
                                        <span className="font-bold text-gray-800">
                                            {service.revisionsLimit} {service.revisionsLimit === 1 ? "time" : "times"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingPackage(service)} 
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition shadow-sm"
                                >
                                    <Pen size={13} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    disabled={deleting === service.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-red-100 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50/50 disabled:bg-gray-100 disabled:text-gray-400 transition"
                                >
                                    {deleting === service.id ? (
                                        <Loader2 size={13} className="animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 size={13} />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Service Card Component Box */}
                    <button
                        onClick={onAddClick}
                        className="rounded-3xl p-6 border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50/40 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center min-h-[320px]"
                    >
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl shadow-sm">+</div>
                        <div className="mt-2">
                            <p className="font-bold text-gray-800 text-sm">Add Custom Tier</p>
                            <p className="text-xs text-gray-400 max-w-[160px] mx-auto mt-0.5">Setup a new configured value package</p>
                        </div>
                    </button>
                </div>
            )}

            {/* UPDATE DIALOG MODAL WINDOW */}
            {editingPackage && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all">
                        <AddServiceForm
                            productId={productId}
                            initialData={editingPackage} 
                            onClose={() => setEditingPackage(null)}
                            onSuccess={() => {
                                setEditingPackage(null);
                                loadServices(); 
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}