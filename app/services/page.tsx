"use client";
 
import React, { useEffect, useState, useMemo } from "react";
import { ServicePackageResponse } from "@/types/service";
import { servicePackageService } from "@/services/service-package/service-package.service";
import { cartService } from "@/services/cart/cart.service";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { 
  Search, SlidersHorizontal, ShoppingCart, Zap, Calendar, 
  RefreshCcw, User, Layers, Sparkles, AlertCircle, Loader2 
} from "lucide-react";
import Link from "next/link";
 
export default function ServicesListingPage() {
  const [services, setServices] = useState<ServicePackageResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  // Cart & Auth Stores
  const { incrementCount } = useCartStore();
  const { user } = useAuthStore();
 
  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [maxDeliveryDays, setMaxDeliveryDays] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<string>("recommended");
 
  useEffect(() => {
    loadServices();
  }, []);
 
  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await servicePackageService.getAllActivePackages();
      setServices(data || []);
    } catch (err: any) {
      console.error("Failed to load services", err);
      setError("Unable to retrieve service packages at this moment.");
    } finally {
      setLoading(false);
    }
  };
    // const handleOrderNow = async (pkg: ServicePackageResponse) => {
    //     if (!user) {
    //         alert("Vui lòng đăng nhập!");
    //         return;
    //     }
    //
    //     try {
    //         const initRes = await paymentService.initPayment({
    //             orderId: pkg.id, // ID của gói dịch vụ
    //             amount: pkg.price,
    //             provider: 'VNPAY' // Hoặc chọn provider
    //         });
    //         window.location.href = initRes.paymentUrl; // Chuyển hướng sang cổng thanh toán
    //     } catch (err) {
    //         alert("Có lỗi khi tạo yêu cầu thanh toán.");
    //     }
    // };
 
  const handleAddToCart = async (pkg: ServicePackageResponse) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm dịch vụ vào giỏ hàng!");
      return;
    }
 
    try {
      const res = await cartService.addCartItem(pkg.id);
      if (res.success) {
        incrementCount();
      }
      if (res.exists) {
        alert(`Đã thêm gói "${pkg.title}" vào giỏ hàng!`);
      } else {
        alert(`Đã có lỗi khi thêm gói "${pkg.title}" vào giỏ hàng!`);
      }
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    }
  };
 
  const handleOrderNow = (pkg: ServicePackageResponse) => {
    alert(`Đang tiến hành kết nối đặt hàng gói "${pkg.title}" với designer...`);
  };
 
  const handleTierToggle = (tier: string) => {
    setSelectedTiers(prev => 
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    );
  };
 
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTiers([]);
    setMinPrice("");
    setMaxPrice("");
    setMaxDeliveryDays("");
    setSortBy("recommended");
  };
 
  // Core Search / Filter / Sort Logic
  const filteredServices = useMemo(() => {
    let result = [...services];
 
    // 1. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query) ||
        (s.designerName && s.designerName.toLowerCase().includes(query)) ||
        (s.productTitle && s.productTitle.toLowerCase().includes(query))
      );
    }
 
    // 2. Tiers Filter
    if (selectedTiers.length > 0) {
      result = result.filter(s => selectedTiers.includes(s.packageType.toUpperCase()));
    }
 
    // 3. Price Filter
    if (minPrice !== "") {
      result = result.filter(s => s.price >= Number(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter(s => s.price <= Number(maxPrice));
    }
 
    // 4. Delivery Days Filter
    if (maxDeliveryDays !== "") {
      result = result.filter(s => s.deliveryDays <= Number(maxDeliveryDays));
    }
 
    // 5. Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "delivery_fast") {
      result.sort((a, b) => a.deliveryDays - b.deliveryDays);
    } else if (sortBy === "revisions_high") {
      result.sort((a, b) => b.revisionsLimit - a.revisionsLimit);
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
 
    return result;
  }, [services, searchQuery, selectedTiers, minPrice, maxPrice, maxDeliveryDays, sortBy]);
 
  const getTierBadgeStyles = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BASIC':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'MEDIUM':
        return 'bg-sky-50 text-sky-600 border-sky-200';
      case 'PREMIUM':
      case 'PRO':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'PRO_MAX':
      case 'VIP':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CUSTOM':
        return 'bg-pink-50 text-pink-600 border-pink-100';
      default:
        return 'bg-purple-50 text-purple-600 border-purple-100';
    }
  };
 
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1e293b]">
      {/* HERO BANNER SECTION */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20 inline-block mb-3">
            Hire Professionals
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Browse Creative & Design Services
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Order tailored edits, custom designs, and photo retouching directly from our community of expert designers.
          </p>
        </div>
      </section>
 
      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* SEARCH & MOBILE FILTER ROW */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-3xl border border-gray-200/60 shadow-xs">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services by title, designer name, design style..."
              className="w-full pl-11 pr-4 py-3 border border-gray-150 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-gray-400 font-bold uppercase hidden md:inline">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-150 px-4 py-3 rounded-2xl text-sm bg-white font-semibold outline-none focus:border-indigo-500 cursor-pointer min-w-[150px]"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="delivery_fast">Fastest Delivery</option>
              <option value="revisions_high">Most Revisions</option>
              <option value="name_asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
 
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTER PANEL */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xs p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-indigo-600" />
                  Filters
                </h3>
                <button 
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  Reset All
                </button>
              </div>
 
              {/* Tiers Checkbox Group */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-800">Service Tiers</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {["BASIC", "MEDIUM", "PREMIUM", "PRO_MAX", "CUSTOM"].map((tier) => (
                    <label key={tier} className="flex items-center gap-2.5 font-medium cursor-pointer hover:text-gray-900 select-none">
                      <input
                        type="checkbox"
                        checked={selectedTiers.includes(tier)}
                        onChange={() => handleTierToggle(tier)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500/20 border-gray-300 cursor-pointer"
                      />
                      <span>{tier.replace("_", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>
 
              {/* Price Range inputs */}
              <div className="space-y-3 border-t border-gray-50 pt-4">
                <h4 className="font-bold text-sm text-gray-800">Price Range (USD)</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Min"
                    className="w-full border border-gray-150 px-3 py-2 rounded-xl text-sm focus:border-indigo-500 outline-none text-center"
                    min="0"
                  />
                  <span className="text-gray-400 text-xs">to</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Max"
                    className="w-full border border-gray-150 px-3 py-2 rounded-xl text-sm focus:border-indigo-500 outline-none text-center"
                    min="0"
                  />
                </div>
              </div>
 
              {/* Delivery Days Filter */}
              <div className="space-y-3 border-t border-gray-50 pt-4">
                <h4 className="font-bold text-sm text-gray-800">Max Delivery Time</h4>
                <select
                  value={maxDeliveryDays}
                  onChange={(e) => setMaxDeliveryDays(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full border border-gray-150 px-3 py-2 rounded-xl text-sm bg-white focus:border-indigo-500 outline-none cursor-pointer"
                >
                  <option value="">Any Delivery Time</option>
                  <option value="1">Within 24 Hours</option>
                  <option value="3">Within 3 Days</option>
                  <option value="5">Within 5 Days</option>
                  <option value="10">Within 10 Days</option>
                </select>
              </div>
            </div>
          </aside>
 
          {/* RESULTS AREA */}
          <main className="flex-grow">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-4 flex gap-3 text-red-700 text-sm mb-6">
                <AlertCircle size={20} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}
 
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-150/60 shadow-2xs min-h-[400px]">
                <Loader2 size={36} className="animate-spin text-indigo-600 mb-3" />
                <span className="text-sm font-semibold text-gray-400">Fetching design services...</span>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-150/60 shadow-2xs flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Services Found</h3>
                <p className="text-gray-400 text-sm max-w-sm mt-1 mb-6">We couldn't find any service packages matching your filters. Try resetting the filters to view all.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full transition shadow-sm shadow-indigo-100"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((pkg) => {
                  const isPremium = pkg.packageType?.toUpperCase() === "PREMIUM" || pkg.packageType?.toUpperCase() === "PRO_MAX";
 
                  return (
                    <div
                      key={pkg.id}
                      className={`rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between hover:shadow-xl relative
                        ${isPremium ? "border-indigo-400/80 shadow-xs" : "border-gray-200/70 shadow-2xs"}
                      `}
                    >
                      {isPremium && (
                        <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                          Premium Tier
                        </div>
                      )}
 
                      <div>
                        {/* Header Title and Badge */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg font-extrabold text-gray-900 capitalize line-clamp-1">
                            {pkg.title}
                          </h3>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 border rounded-full uppercase tracking-wider shrink-0 ${getTierBadgeStyles(pkg.packageType)}`}>
                            {pkg.packageType}
                          </span>
                        </div>
 
                        {/* Price */}
                        <div className="text-3xl font-black text-indigo-600 my-4">
                          ${Number(pkg.price).toFixed(2)}
                        </div>
 
                        {/* Designer Profile Info */}
                        {pkg.designerName && (
                          <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
                            <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm flex items-center justify-center text-gray-400 shrink-0">
                              {pkg.designerAvatar ? (
                                <img src={pkg.designerAvatar} alt={pkg.designerName} className="w-full h-full object-cover" />
                              ) : (
                                <User size={12} />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-800 leading-tight">By {pkg.designerName}</p>
                              <p className="text-[10px] text-emerald-500 font-medium">Available for Hire</p>
                            </div>
                          </div>
                        )}
 
                        {/* Associated Design Style */}
                        {pkg.productTitle && pkg.productId && (
                          <div className="mb-4">
                            <Link 
                              href={`/products/${pkg.productId}`}
                              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-100/40 w-full transition"
                            >
                              <Layers size={12} className="shrink-0 text-indigo-400" />
                              <span className="line-clamp-1">Style: {pkg.productTitle}</span>
                            </Link>
                          </div>
                        )}
 
                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed min-h-[60px]">
                          {pkg.description}
                        </p>
                      </div>
 
                      {/* Technical details & Actions */}
                      <div>
                        <div className="space-y-2 mb-5 text-[11px] text-gray-500 font-semibold border-t border-gray-50 pt-4">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1"><Calendar size={13} className="text-gray-400" /> Delivery:</span>
                            <span className="font-extrabold text-gray-800">{pkg.deliveryDays} {pkg.deliveryDays === 1 ? 'day' : 'days'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1"><RefreshCcw size={13} className="text-gray-400" /> Revisions:</span>
                            <span className="font-extrabold text-gray-800">{pkg.revisionsLimit} {pkg.revisionsLimit === 1 ? 'time' : 'times'}</span>
                          </div>
                        </div>
 
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(pkg)}
                            className="p-3 bg-slate-50 border border-gray-150 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl active:scale-95 transition-all shadow-2xs"
                            title="Add to Cart"
                          >
                            <ShoppingCart size={16} />
                          </button>
                          <button
                            onClick={() => handleOrderNow(pkg)}
                            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <Zap size={13} className="text-indigo-200 fill-indigo-200" />
                            Hire Designer
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
