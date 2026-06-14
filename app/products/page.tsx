"use client"

import React, {useEffect, useState} from "react";
import CardProduct from "@/components/products/CardProduct";
import {CardProductResponse} from "@/types/product";
import {productService} from "@/services/products/product.service";

export default function ProductListingPage() {
  const [products, setProducts] = useState<CardProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await productService.getNewestProducts();
        if (mounted) setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Discover Designs</h1>
      </div>

      <div className="flex gap-8">
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Logos
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Banners
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> UI/UX
                </label>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-end mb-4">
            <select className="border rounded px-2 py-1 text-sm">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Sold</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="border rounded-lg p-4 text-center text-muted-foreground italic">Loading products...</div>
            ) : (
              products.map(p => (
                <CardProduct key={p.id} {...p} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
