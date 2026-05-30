import ProductForm from "@/components/products/ProductForm";
import UploadBox from "@/components/products/UploadBox";

export default function AddProductPage() {
    return (
        <div className="flex min-h-screen bg-[#f8faff]">
            <main className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
                    <button className="text-sm text-gray-500 hover:text-violet-600 transition-colors">
                        ← Back to Profile
                    </button>
                    <h2 className="text-lg font-bold text-slate-700">Add New Product to Bio</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200" />
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-10 max-w-4xl mx-auto w-full overflow-y-auto">
                    <UploadBox />
                    <ProductForm />

                    <p className="text-center text-[11px] text-gray-400 mt-8 italic">
                        Project will be visible on your Ethereal Bio immediately after publishing.
                    </p>
                </div>
            </main>
        </div>
    );
}