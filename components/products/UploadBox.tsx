"use client";

import { useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { FilePreview } from "@/types/file";
import { useProductStore } from "@/store/addProductStore";

interface MultiUploadBoxProps {
    isEditMode?: boolean;
    initialImages?: { id: string; url: string }[];
    initialThumbnailUrl?: string;
}

export default function MultiUploadBox({ isEditMode = false, initialImages, initialThumbnailUrl }: MultiUploadBoxProps) {
    const { previews, thumbnailId } = useProductStore();
    const setField = useProductStore((state) => state.setField);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Không tự động gán dữ liệu ban đầu nữa mà chỉ làm nhiệm vụ dọn dẹp RAM
    useEffect(() => {
        return () => {
            previews.forEach(item => {
                if (item.file) URL.revokeObjectURL(item.url);
            });
        };
    }, []);

    const handleClick = () => fileInputRef.current?.click();

    const processFiles = (files: FileList | File[]) => {
        const newPreviews: FilePreview[] = Array.from(files)
            .filter((file) => file.type.startsWith("image/"))
            .map((file) => ({
                id: Math.random().toString(36).substring(7),
                url: URL.createObjectURL(file),
                file: file,
            }));

        const updated = [...previews, ...newPreviews];
        if (!thumbnailId && updated.length > 0) {
            setField("thumbnailId", updated[0].id);
        }
        setField("previews", updated);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) processFiles(e.target.files);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
    };

    const removeFile = (id: string) => {
        const filtered = previews.filter((item) => item.id !== id);

        if (id === thumbnailId) {
            setField("thumbnailId", filtered.length > 0 ? filtered[0].id : null);
        }

        const removedItem = previews.find((item) => item.id === id);
        if (removedItem && removedItem.file) {
            URL.revokeObjectURL(removedItem.url);
        }
        setField("previews", filtered);
    };

    return (
        <div className="space-y-6 mb-8">
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-[2rem] p-10 text-center hover:bg-blue-50 transition-all cursor-pointer group"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                />

                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <p className="text-gray-700 font-medium">
                    Drag & drop your design here or <span className="text-violet-600 underline">Browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-2 italic">Mẹo: Click vào ảnh bên dưới để chọn làm ảnh bìa (Thumbnail)</p>
            </div>

            {previews.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">Project Assets ({previews.length})</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                        {previews.map((item) => {
                            const isThumbnail = item.id === thumbnailId;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setField("thumbnailId", item.id)}
                                    className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all border-4 
                                    ${isThumbnail ? "border-violet-500 shadow-lg scale-[1.02]" : "border-transparent hover:border-violet-200"}`}
                                >
                                    <img
                                        src={item.url}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />

                                    {isThumbnail && (
                                        <div className="absolute top-2 left-2 bg-violet-500 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-md">
                                            THUMBNAIL
                                        </div>
                                    )}

                                    {!isThumbnail && (
                                        <div className="absolute inset-0 bg-violet-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[10px] font-bold bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">Đặt làm ảnh bìa</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(item.id);
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-red-500 hover:text-white text-gray-500 rounded-full flex items-center justify-center shadow-sm transition-colors"
                                    >
                                        <span className="text-[14px]">×</span>
                                    </button>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={handleClick}
                            className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:border-violet-200 hover:text-violet-400 transition-all bg-gray-50/50"
                        >
                            <span className="text-2xl font-light">+</span>
                            <span className="text-[10px] font-bold uppercase">Add</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}