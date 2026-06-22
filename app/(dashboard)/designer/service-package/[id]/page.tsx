'use client';

import { useState } from 'react';
import { Plus, LayoutGrid, Sparkles, ArrowLeft } from 'lucide-react';
import AddServiceForm from '@/components/service-packages/AddServiceForm';
import DesignerServicesList from '@/components/service-packages/DesignerServicesList';
import {notFound, useParams, useRouter} from "next/navigation";

export default function DesignerPage() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const handleAddSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (!productId) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full">
            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* BACK BUTTON */}
                <div className="mb-6">
                    <div 
                        onClick={router.back}
                        className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </div>
                </div>

                {/* SERVICE HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mt-1 hidden sm:block">
                            <Sparkles size={22} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Service Packages
                            </h2>
                            <p className="text-gray-500 mt-1 text-sm">
                                Manage, customize, and update tier packages for this specific product.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold transition-all duration-200 shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95"
                    >
                        <Plus size={18} />
                        Add New Package
                    </button>
                </div>

                {/* SERVICE LIST BOX */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 min-h-[400px]">
                    <div className="flex items-center gap-2 mb-6 text-gray-400 border-b border-gray-50 pb-4">
                        <LayoutGrid size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Available Tiers</span>
                    </div>

                    <DesignerServicesList
                        productId={productId}
                        onAddClick={() => setShowAddForm(true)}
                        refreshTrigger={refreshTrigger}
                    />
                </div>

            </main>

            {/* Add Service Modal Overlay */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all">
                        <AddServiceForm
                            productId={productId}
                            onClose={() => setShowAddForm(false)}
                            onSuccess={handleAddSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}