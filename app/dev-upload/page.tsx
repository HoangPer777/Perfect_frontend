"use client";

import FileUploader from "@/components/shared/FileUploader";

export default function DevUploadPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Dev: Upload a file</h1>
      <FileUploader />
    </div>
  );
}
