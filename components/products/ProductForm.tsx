"use client";

import { useProductStore } from "@/store/addProductStore";
import { useEffect, useRef, useState } from "react";
import { cloudinary } from "@/services/cloudinary/upload.service";
import { productService } from "@/services/products/product.service";
import { Category } from "@/types/category";
import {AddProductRequest, AddProductResponse} from "@/types/product";

interface ProductFormProps {
    isEditMode?: boolean;
    initialData?: AddProductResponse;
    onDeleteSuccess?: () => void;
    onSaveSuccess?: (data: AddProductResponse) => void;
}

export default function ProductForm({ isEditMode = false, initialData, onDeleteSuccess, onSaveSuccess }: ProductFormProps) {
    const { title, description, previews, thumbnailId, categories, status, toggleCategory, setField, resetForm } = useProductStore();
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [mounted, setMounted] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const loadInitialValues = () => {
        if (isEditMode && initialData) {
            setField("title", initialData.title);
            setField("description", initialData.description);
            setField("categories", initialData.categories);
            setField("status", initialData.status); 

            if (initialData.images && initialData.images.length > 0) {
                const mappedPreviews = initialData.images.map((img, index) => ({
                    id: img.id || `old-img-${index}-${Math.random().toString(36).substring(5)}`,
                    url: img.url,
                    file: null as any,
                }));
                setField("previews", mappedPreviews);

                if (initialData.thumbnailUrl) {
                    const foundThumb = mappedPreviews.find(p => p.url === initialData.thumbnailUrl);
                    if (foundThumb) {
                        setField("thumbnailId", foundThumb.id);
                    } else {
                        setField("thumbnailId", mappedPreviews[0].id);
                    }
                } else if (mappedPreviews.length > 0) {
                    setField("thumbnailId", mappedPreviews[0].id);
                }
            } else {
                setField("previews", []);
                setField("thumbnailId", null);
            }
        } else if (!isEditMode) {
            resetForm();
            setField("status", "PUBLISHED"); // Giá trị mặc định khi tạo mới
        }
    };

    useEffect(() => {
        loadInitialValues();
    }, [isEditMode, initialData]);

    useEffect(() => {
        setMounted(true);

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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString || !mounted) return "";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
        });
    };

    const handleSaveProduct = async () => {
        if (previews.length < 1) return alert("Vui lòng chọn ít nhất 1 ảnh!");
        if (!title || !description) return alert("Vui lòng nhập đầy đủ thông tin!");

        setLoading(true);
        try {
            const existingUrls = previews.filter(item => !item.file).map(item => item.url);
            const newFilesToUpload = previews.filter(item => item.file);

            let newUploadedImages: any[] = [];
            if (newFilesToUpload.length > 0) {
                const sigData = await cloudinary.getSignature("designer-projects");
                const uploadPromises = newFilesToUpload.map(async (item) => {
                    const res = await cloudinary.uploadSingleImage(item.file!, sigData);
                    return { id: item.id, url: res.secure_url };
                });
                newUploadedImages = await Promise.all(uploadPromises);
            }

            let finalThumbnailUrl = "";
            const currentThumbItem = previews.find(item => item.id === thumbnailId);

            if (currentThumbItem) {
                if (!currentThumbItem.file) {
                    finalThumbnailUrl = currentThumbItem.url;
                } else {
                    const uploadedThumb = newUploadedImages.find(img => img.id === thumbnailId);
                    if (uploadedThumb) finalThumbnailUrl = uploadedThumb.url;
                }
            }

            const allImageUrls = [...existingUrls, ...newUploadedImages.map(img => img.url)];
            if (!finalThumbnailUrl) finalThumbnailUrl = allImageUrls[0] || "";

            const finalData: AddProductRequest = {
                title: title,
                description: description,
                thumbnailUrl: finalThumbnailUrl,
                status: status, // Lấy trực tiếp trạng thái được chọn từ ô select của Store
                images: allImageUrls,
                categories: categories.map(c => c.id)
            };

            if (isEditMode && initialData?.id) {
                finalData.id = initialData.id;
                const data = await productService.updateProduct(finalData);
                if (data) {
                    alert("Cập nhật sản phẩm thành công!");
                    if (onSaveSuccess) onSaveSuccess(data);
                } else {
                    alert("Cập nhật sản phẩm thất bại!");
                }
            } else {
                const data = await productService.addProduct(finalData);
                if (data) {
                    alert("Thêm sản phẩm thành công!");
                    resetForm();
                } else {
                    alert("Thêm sản phẩm thất bại!");
                }
            }
        } catch (e) {
            console.error(e);
            alert("Đã xảy ra lỗi hệ thống!");
        }
        setLoading(false);
    };

    const handleDeleteProduct = async () => {
        if (!initialData?.id) return;
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            setIsDeleting(true);
            // try {
            //     const success = await productService.deleteProduct(productId);
            //     if (success) {
            //         alert("Xóa sản phẩm thành công!");
            //         resetForm();
            //         if (onDeleteSuccess) onDeleteSuccess();
            //     } else {
            //         alert("Xóa sản phẩm thất bại!");
            //     }
            // } catch (error) {
            //     console.error(error);
            //     alert("Lỗi khi xóa sản phẩm!");
            // }
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-8 space-y-6">
            {isEditMode && initialData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-gray-500 mb-2" suppressHydrationWarning>
                    <div className="flex flex-col gap-1">
                        <span className="font-bold uppercase text-[9px] text-gray-400 tracking-wider">Ngày đăng ký (Created)</span>
                        <span className="font-medium text-slate-700">{formatDate(initialData.createdAt)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-bold uppercase text-[9px] text-gray-400 tracking-wider">Cập nhật cuối (Updated)</span>
                        <span className="font-medium text-violet-600">{formatDate(initialData.updatedAt)}</span>
                    </div>
                </div>
            )}

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

            <section>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Status product</label>
                <select
                    value={status || "PUBLISHED"}
                    onChange={(e) => setField("status", e.target.value)}
                    className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-violet-200 outline-none font-medium cursor-pointer"
                >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                </select>
            </section>

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

            <section className="relative" ref={dropdownRef}>
                <div className="flex justify-between items-end mb-3 ml-1">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Project Categories</label>
                    <span className="text-[10px] text-gray-400 font-medium">Tối đa 3 danh mục</span>
                </div>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`min-h-[70px] w-full bg-gray-50 rounded-2xl p-3 flex flex-wrap gap-2 cursor-pointer border-2 transition-all ${isOpen ? "border-violet-200 bg-white shadow-sm" : "border-transparent"}`}
                >
                    {categories.length === 0 && <div className="flex items-center px-3 text-gray-400 text-sm italic">Nhấp để chọn lĩnh vực thiết kế...</div>}
                    {categories.map(cat => (
                        <span key={cat.id} className="bg-violet-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                            {cat.name}
                            <button onClick={(e) => { e.stopPropagation(); toggleCategory(cat); }} className="hover:bg-violet-500 rounded-full w-4 h-4 flex items-center justify-center">×</button>
                        </span>
                    ))}
                </div>
                {isOpen && (
                    <div className="absolute z-20 w-full mt-3 bg-white border border-gray-100 shadow-2xl rounded-[1.5rem] p-4 grid grid-cols-2 gap-2">
                        {availableCategories.map(cat => {
                            const isSelected = categories.some(c => c.id === cat.id);
                            return (
                                <div key={cat.id} onClick={() => toggleCategory(cat)} className={`p-4 rounded-xl text-sm font-medium cursor-pointer transition-all flex justify-between items-center ${isSelected ? "bg-violet-50 text-violet-700" : "text-gray-500 hover:bg-gray-50"}`}>
                                    {cat.name}
                                    {isSelected && <span className="text-violet-600 font-bold">✓</span>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                {isEditMode ? (
                    <>
                        <button
                            type="button"
                            disabled={loading || isDeleting}
                            onClick={handleDeleteProduct}
                            className="px-6 py-3 bg-red-50 text-red-500 rounded-full font-semibold text-sm hover:bg-red-100 transition disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete Product"}
                        </button>

                        <div className="flex gap-2.5">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={loadInitialValues}
                                className="px-5 py-3 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full text-sm font-semibold transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleSaveProduct}
                                className="px-7 py-3 bg-gradient-to-r from-blue-400 to-violet-500 text-white rounded-full font-semibold text-sm shadow-lg shadow-violet-100 hover:scale-105 transition-all"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="ml-auto">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleSaveProduct}
                                className="px-8 py-3 bg-gradient-to-r from-blue-400 to-violet-500 text-white rounded-full font-semibold text-sm shadow-lg hover:scale-105 transition-all"
                            >
                                {loading ? "Saving..." : "Save Product"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}