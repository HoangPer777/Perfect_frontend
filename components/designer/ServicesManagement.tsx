"use client";
 
import React, { useEffect, useState } from "react";
import { ServicePackageResponse } from "@/types/service";
import { servicePackageService } from "@/services/service-package/service-package.service";
import { Pen, Trash2, Loader2, AlertCircle, Sparkles, Plus, Layers, DollarSign, Calendar, RefreshCcw } from "lucide-react";
import AddServiceForm from "@/components/service-packages/AddServiceForm";
 
export default function ServicesManagement() {
    const [services, setServices] = useState<ServicePackageResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
 
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPackage, setEditingPackage] = useState<ServicePackageResponse | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
 
    useEffect(() => {
        loadServices();
    }, [refreshTrigger]);
 
    const loadServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await servicePackageService.getMyAllPackages();
            setServices(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load service packages.");
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
                return "bg-slate-50 border-slate-200 hover:bg-slate-100/50";
            case "MEDIUM":
                return "bg-sky-50/70 border-sky-200 hover:bg-sky-50";
            case "PREMIUM":
            case "PRO":
                return "bg-purple-50/70 border-purple-200 hover:bg-purple-50";
            case "PRO_MAX":
            case "VIP":
                return "bg-amber-50/70 border-amber-200 hover:bg-amber-50";
            case "CUSTOM":
                return "bg-pink-50/70 border-pink-200 hover:bg-pink-50";
            default:
                return "bg-purple-50/70 border-purple-200 hover:bg-purple-50";
        }
    };
 
    const getPackageBadgeColor = (packageType: string) => {
        const type = packageType?.toUpperCase();
        switch (type) {
            case "BASIC":
                return "bg-slate-100 text-slate-700";
            case "MEDIUM":
                return "bg-sky-100 text-sky-700";
            case "PREMIUM":
            case "PRO":
                return "bg-purple-100 text-purple-700";
            case "PRO_MAX":
            case "VIP":
                return "bg-amber-100 text-amber-700";
            case "CUSTOM":
                return "bg-pink-100 text-pink-700";
            default:
                return "bg-purple-100 text-purple-700";
        }
    };
 
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-[#f8fafc]">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Service Packages & Rates</h2>
                    <p className="text-gray-500 mt-1">Manage pricing tiers, delivery days, and revisions for your portfolio designs.</p>
                </div>
 
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold transition-all duration-200 shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95 self-start md:self-center"
                >
                    <Plus size={18} />
                    Add Service Package
                </button>
            </div>
 
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 mb-6">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}
 
            {loading ? (
                <div className="flex items-center justify-center py-20 min-h-[300px]">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 size={36} className="animate-spin text-indigo-600" />
                        <span className="text-sm text-gray-400 font-medium">Loading your services list...</span>
                    </div>
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-150 shadow-xs flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                        <Sparkles size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No Service Packages Configured</h3>
                    <p className="text-gray-400 text-sm max-w-sm mt-1 mb-6">Create customizable tiers (Basic, Premium, Pro Max) for your portfolio designs so customers can hire you.</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition shadow-sm shadow-indigo-100"
                    >
                        + Create First Package
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${getPackageColor(
                                service.packageType
                            )} border-gray-150 hover:shadow-xl bg-white`}
                        >
                            <div>
                                {/* Header with Title and Badge */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize line-clamp-1">
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
 
                                {/* Associated Product */}
                                {service.productTitle && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2 font-medium bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100/60 inline-flex">
                                        <Layers size={12} className="text-gray-400" />
                                        <span className="line-clamp-1">Design: <strong className="text-gray-700">{service.productTitle}</strong></span>
                                    </div>
                                )}
 
                                {/* Price */}
                                <div className="text-3xl font-black text-indigo-600 my-4">
                                    ${Number(service.price).toFixed(2)}
                                </div>
 
                                {/* Description */}
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                                    {service.description}
                                </p>
 
                                <hr className="border-gray-100 my-4" />
 
                                {/* Details */}
                                <div className="space-y-2.5 mb-6 text-xs text-gray-600 font-medium">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1"><Calendar size={13} className="text-gray-400"/> Delivery Time:</span>
                                        <span className="font-bold text-gray-800">{service.deliveryDays} {service.deliveryDays === 1 ? 'day' : 'days'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1"><RefreshCcw size={13} className="text-gray-400"/> Revisions Limit:</span>
                                        <span className="font-bold text-gray-800">
                                            {service.revisionsLimit} {service.revisionsLimit === 1 ? "time" : "times"}
                                        </span>
                                    </div>
                                </div>
                            </div>
 
                            {/* Action Buttons */}
                            <div className="flex gap-2 border-t border-gray-50 pt-4">
                                <button
                                    onClick={() => setEditingPackage(service)} 
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50 transition shadow-xs active:scale-[0.98]"
                                >
                                    <Pen size={13} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    disabled={deleting === service.id}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-red-100 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50/50 disabled:bg-gray-100 disabled:text-gray-400 transition active:scale-[0.98]"
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
                </div>
            )}
 
            {/* Create Service Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <AddServiceForm
                            onClose={() => setShowAddForm(false)}
                            onSuccess={() => {
                                setShowAddForm(false);
                                setRefreshTrigger(prev => prev + 1);
                            }}
                        />
                    </div>
                </div>
            )}
 
            {/* Edit Service Modal */}
            {editingPackage && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <AddServiceForm
                            initialData={editingPackage} 
                            onClose={() => setEditingPackage(null)}
                            onSuccess={() => {
                                setEditingPackage(null);
                                setRefreshTrigger(prev => prev + 1);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
