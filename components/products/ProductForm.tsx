"use client";

import { useProductStore } from "@/store/addProductStore";
import { useEffect, useRef, useState } from "react";
import { cloudinary } from "@/services/cloudinary/upload.service";
import {productService} from "@/services/products/product.service";
import {Category} from "@/types/category";
import {AddProductRequest} from "@/types/product";

export default function ProductForm() {
    const { title, description, previews, thumbnailId, categories, toggleCategory, setField, resetForm } = useProductStore();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        const fetchCategories = async () => {
            try {
                const data = await productService.getAllLeafCategories();
                setAvailableCategories(data);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };

        fetchCategories();

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); 
    
    const handleAddProduct = async (status: string) => {
        if (previews.length < 1) {
            return alert("Vui lòng chọn ít nhất 1 ảnh!");
        }
        if(!title || !description) {
            return alert("Vui lòng nhập đầy đủ thông tin!")
        }
        setLoading(true);
        try {
            const sigData = await cloudinary.getSignature("designer-projects");
            const uploadPromises = previews.map(async (item) => {
                const res = await cloudinary.uploadSingleImage(item.file, sigData);
                return {
                    url: res.secure_url,
                    publicId: res.public_id,
                    isThumbnail: item.id === thumbnailId
                }
            });
            const uploadedImages = await Promise.all(uploadPromises);
            const thumbnailObj = uploadedImages.find(i => i.isThumbnail);
            const finalData:AddProductRequest = {
                title:  title,
                description: description,
                thumbnailUrl: thumbnailObj ? thumbnailObj.url : uploadedImages[0].url,
                status: status,
                images: uploadedImages.map(i => i.url),
                categories: categories.map(c => c.id) 
            };
            const data = await productService.addProduct(finalData);
            console.log(data);
            if(data) {
                alert("Thêm sản phẩm thành công!")
                resetForm()
            } else {
                alert("Thêm sản phẩm thất bại!")
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false)
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-8 space-y-6">
            {/* Title */}
            <section>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Project Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="e.g. Dreamscape Brand Identity"
                    className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-violet-200 outline-none"
                />
            </section>

            {/* Story */}
            <section>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Story & Process</label>
                <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Tell the story behind this design..."
                    className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-violet-200 outline-none resize-none"
                />
            </section>

            {/* Category Section - SỬA TẠI ĐÂY */}
            <section className="relative" ref={dropdownRef}>
                <div className="flex justify-between items-end mb-3 ml-1">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                        Project Categories
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">Tối đa 3 danh mục</span>
                </div>

                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`min-h-[70px] w-full bg-gray-50 rounded-2xl p-3 flex flex-wrap gap-2 cursor-pointer border-2 transition-all
                        ${isOpen ? "border-violet-200 bg-white shadow-sm" : "border-transparent"}`}
                >
                    {categories.length === 0 && (
                        <div className="flex items-center px-3 text-gray-400 text-sm italic">
                            Nhấp để chọn lĩnh vực thiết kế...
                        </div>
                    )}

                    {/* Hiển thị các danh mục ĐÃ CHỌN từ Store */}
                    {categories.map(cat => (
                        <span
                            key={cat.id}
                            className="bg-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm shadow-violet-200 animate-in fade-in zoom-in duration-200"
                        >
                            {cat.name}
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleCategory(cat); }}
                                className="hover:bg-violet-500 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-20 w-full mt-3 bg-white border border-gray-100 shadow-2xl rounded-[1.5rem] p-4 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
                        {availableCategories.map(cat => {
                            // Kiểm tra xem item này có trong store chưa
                            const isSelected = categories.some(c => c.id === cat.id);
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat)}
                                    className={`p-4 rounded-xl text-sm font-medium cursor-pointer transition-all flex justify-between items-center
                                        ${isSelected
                                        ? "bg-violet-50 text-violet-700"
                                        : "text-gray-500 hover:bg-gray-50"}`}
                                >
                                    {cat.name}
                                    {isSelected && <span className="text-violet-600 font-bold">✓</span>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-6">
                <button disabled={loading} className="px-8 py-3 bg-gray-100 text-gray-600 rounded-full font-semibold text-sm hover:bg-gray-200 transition">
                    {loading ? "Saving..." : "Save as Draft"}
                </button>
                <button disabled={loading} onClick={()=> handleAddProduct("PUBLISHED")} className="px-8 py-3 bg-gradient-to-r from-blue-400 to-violet-500 text-white rounded-full font-semibold text-sm shadow-lg shadow-violet-100 hover:scale-105 transition-transform">
                    {loading ? "Publishing..." : "Publish Project"}
                </button>
            </div>
        </div>
    );
}