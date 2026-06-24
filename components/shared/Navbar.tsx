"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Bell, ShoppingCart, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {useCartStore} from "@/store/cartStore";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cartCount, resetCount } = useCartStore()
      
  useEffect(() => {
    setMounted(true);
    
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    resetCount();
    logout();
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Perfect Market
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">Products</Link>
              <Link href="/services" className="text-gray-600 hover:text-primary transition-colors">Services</Link>
              <Link href="/designers" className="text-gray-600 hover:text-primary transition-colors">Top Designers</Link>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-input rounded-full bg-muted/50 focus:bg-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Search for designs, services..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
                href="/cart"
                className="p-2 hover:bg-muted rounded-full relative text-gray-600 hover:text-primary transition-colors flex items-center justify-center"
            >
              <ShoppingCart size={20} />
              {cartCount !== null && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-scaleUp">
                        {cartCount > 99 ? "99+" : cartCount}
                    </span>
              )}
            </Link>
            <Link href="/notifications" className="p-2 hover:bg-muted rounded-full relative text-gray-600 hover:text-primary transition-colors">
              <Bell size={20} />
              {/* TODO: Add notification red dot */}
            </Link>

            {/* Auth Section */}
            {!mounted ? (
              <div className="flex items-center gap-2 border px-4 py-1.5 rounded-full bg-slate-50 text-gray-400">
                <User size={18} />
                <span className="text-sm font-medium w-10 h-4 bg-gray-200 animate-pulse rounded" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 border px-3 py-1.5 rounded-full hover:bg-muted transition-all active:scale-95"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#4f6d7a] to-[#6b5b95] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user.username ? user.username.substring(0, 2) : "US"}
                  </div>
                  <span className="text-sm font-medium max-w-[80px] truncate hidden sm:inline-block">
                    {user.username || user.email.split("@")[0]}
                  </span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-gray-700 truncate">{user.email}</p>
                      <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600">
                        {user.role}
                      </span>
                    </div>

                    <Link 
                      href={user.role === "DESIGNER" ? "/designer/dashboard" : "/customer/dashboard"} 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-muted transition-colors w-full text-left"
                    >
                      <LayoutDashboard size={16} className="text-gray-500" />
                      Dashboard
                    </Link>

                    <Link 
                      href="/profile/settings" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-muted transition-colors w-full text-left"
                    >
                      <User size={16} className="text-gray-500" />
                      Profile settings
                    </Link>

                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left border-t border-gray-50"
                    >
                      <LogOut size={16} className="text-red-500" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 border px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all active:scale-95 duration-200">
                <User size={18} />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
