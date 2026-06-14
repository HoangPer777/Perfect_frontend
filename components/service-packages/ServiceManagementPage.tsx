'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddServiceForm from '@/components/service-packages/AddServiceForm';
import DesignerServicesList from '@/components/service-packages/DesignerServicesList';

export default function ServiceManagementPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Quản lý dịch vụ</h1>
              <p className="text-gray-500 mt-2">
                Quản lý và cập nhật các gói dịch vụ thiết kế của bạn.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-700 transition"
            >
              <Plus size={18} />
              Thêm gói dịch vụ
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-[32px] p-8">
          <DesignerServicesList onAddClick={() => setShowAddForm(true)} refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {showAddForm && (
        <AddServiceForm onClose={() => setShowAddForm(false)} onSuccess={handleAddSuccess} />
      )}
    </div>
  );
}
