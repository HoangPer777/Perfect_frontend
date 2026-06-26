'use client';

import { useState } from 'react';
import ProductGrid from "@/components/products/DesignerProducts";
import {Layers, LayoutGrid, ShoppingBag} from 'lucide-react';
import DesignerOverview from "@/components/designer/Overview";

type TabType = 'Overview' | 'Orders' | 'Products';

export default function DesignerPage() {
    const [activeTab, setActiveTab] = useState<TabType>('Overview');

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'Overview', label: 'Overview', icon: <Layers size={16} /> },
        { id: 'Orders', label: 'Orders', icon: <ShoppingBag size={16} /> },
        { id: 'Products', label: 'Products', icon: <LayoutGrid size={16} /> },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col w-full">

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* MODERN TABS SYSTEM */}
                <div className="flex gap-8 border-b border-gray-200 mb-8">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 flex items-center gap-2 text-sm font-semibold tracking-wide transition-all duration-200 relative border-b-2
                                    ${isActive
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* CONDITIONAL RENDER PER TAB */}
                <div className="w-full transition-all duration-300">
                    {activeTab === 'Products' ? (
                        <ProductGrid />
                    ) : activeTab === 'Overview' ? <DesignerOverview /> : (
                        /* Placeholder style for upcoming tabs */
                        <div className="w-full min-h-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
                                {tabs.find(t => t.id === activeTab)?.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{activeTab} section is coming soon</h3>
                            <p className="text-gray-400 text-sm max-w-xs mt-1">We are currently organizing this section to display analytics and rich metrics.</p>
                        </div>
                    )}
                </div>

            </main>

        </div>
    );
}