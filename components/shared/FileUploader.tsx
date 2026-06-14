"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const upload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setLoading(true);
    try {
      const res = await api.post("/files/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const backendBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/api\/v1\/?$/, "");
      setUrl(backendBase + res.data.url);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded shadow-sm">
      <input type="file" onChange={onChange} />
      <div>
        <button
          onClick={upload}
          disabled={!file || loading}
          className="px-4 py-2 bg-violet-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {url && (
        <div>
          <p className="text-sm">File available at:</p>
          <a href={url} target="_blank" rel="noreferrer" className="text-violet-600 underline">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
