'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    CalendarDays,
    ChevronDown,
    ShoppingCart,
    Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DesignerChartResponse } from "@/types/chart";
import {taskService} from "@/services/order/task.service";
import {notFound} from "next/navigation";

type TimeRangeType = 'This Week' | 'This Month' | 'This Year';
const PIE_COLORS = ['#8b5cf6', '#a78bfa', '#ddd6fe', '#e0f2fe', '#c084fc', '#6366f1'];

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-full min-h-[180px]">
        <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                {icon}
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {isPositive ? '+' : ''}{change}
            </span>
        </div>
        <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-black text-gray-950 mt-1">{value}</p>
        </div>
    </div>
);

export default function DesignerOverview() {
    const [timeRange, setTimeRange] = useState<TimeRangeType>('This Week');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [allChartData, setAllChartData] = useState<DesignerChartResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setIsLoading(true);
                const data = await taskService.getDesignerChart();
                setAllChartData(data);
            } catch (error) {
                notFound();
            } finally {
                setIsLoading(false);
            }
        };
        fetchChartData();
    }, []);

    // Đóng dropdown khi bấm ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLoading || !allChartData) {
        return (
            <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-[#f8fafc]">
                <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
                <p className="text-sm font-semibold text-gray-500">Calibrating financial overview analytics...</p>
            </div>
        );
    }

    const activePeriodData = allChartData[timeRange];
    const totalPieValue = activePeriodData.pie?.reduce((sum, item) => sum + item.value, 0) || 1;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-[#f8fafc]">

            {/* HEADER & TIMEFRAME FILTER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-950 tracking-tight">Financial Overview</h2>
                    <p className="text-gray-500 mt-1">
                        Viewing performance metrics analytics calibrated for <span className="text-purple-600 font-semibold lowercase">{timeRange}</span>.
                    </p>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm active:scale-95"
                    >
                        <CalendarDays size={18} className="text-purple-500" />
                        {timeRange}
                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 py-1.5 overflow-hidden animate-fadeIn">
                            {(['This Week', 'This Month', 'This Year'] as TimeRangeType[]).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        setTimeRange(option);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors
                                        ${timeRange === option
                                        ? 'bg-purple-50 text-purple-600'
                                        : 'text-gray-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={activePeriodData.stats.revenue}
                    change={activePeriodData.stats.revChange}
                    isPositive={parseFloat(activePeriodData.stats.revChange) >= 0}
                    icon={<TrendingUp size={20} />}
                />
                <StatCard
                    title="Total Orders"
                    value={activePeriodData.stats.orders}
                    change={activePeriodData.stats.ordChange}
                    isPositive={parseFloat(activePeriodData.stats.ordChange) >= 0}
                    icon={<ShoppingCart size={20} />}
                />
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                {/* Biểu đồ cột */}
                <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                                <BarChart3 size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-950">Revenue Dynamics</h3>
                        </div>
                        <span className="text-sm font-medium text-gray-500">{timeRange} Analytics</span>
                    </div>
                    <div className="w-full h-80 text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activePeriodData.bar} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" />
                                <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" tickFormatter={(value) => `$${value >= 1000 ? (value/1000) + 'k' : value}`} />
                                <Tooltip
                                    contentStyle={{ border: 'none', borderRadius: '12px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f1f5f9', radius: 4 }}
                                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Biểu đồ tròn */}
                <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                            <PieChartIcon size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-950">Revenue by Product</h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="h-[220px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={activePeriodData.pie}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        dataKey="value"
                                        cornerRadius={6}
                                    >
                                        {activePeriodData.pie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ border: 'none', borderRadius: '12px', padding: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Sales']}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Total</p>
                                <p className="text-2xl font-black text-gray-950">{activePeriodData.totalPie}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-6 text-xs w-full px-2">
                            {activePeriodData.pie.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                                    <span className="text-gray-600 font-medium truncate max-w-[85px]" title={entry.name}>{entry.name}</span>
                                    <span className="text-gray-400 ml-auto font-bold">
                                        {((entry.value / totalPieValue) * 100).toFixed(0)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}