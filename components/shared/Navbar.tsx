"use client";

import Link from "next/link";
import { Search, User, Bell, ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Perfect Market
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/products">Products</Link>
              <Link href="/services">Services</Link>
              <Link href="/designers">Top Designers</Link>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-input rounded-full bg-muted/50 focus:bg-white transition-colors text-sm"
                placeholder="Search for designs, services..."
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 hover:bg-muted rounded-full relative">
              <ShoppingCart size={20} />
              {/* TODO: Add items count bubble */}
            </Link>
            <Link href="/notifications" className="p-2 hover:bg-muted rounded-full relative">
              <Bell size={20} />
              {/* TODO: Add notification red dot */}
            </Link>
            <Link href="/login" className="flex items-center gap-2 border px-4 py-1.5 rounded-full hover:bg-muted transition-colors">
              <User size={18} />
              <span className="text-sm font-medium">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
