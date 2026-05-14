import api from "@/lib/api";

interface SignatureResponse {
    signature: string;
    timestamp: string;
    cloud_name: string;
    api_key: string;
    folder: string;
}

interface UploadResponse {
    secure_url: string,
    public_id: string
}

export const cloudinary = {
    getSignature: async (folderName: string): Promise<SignatureResponse> => {
        const response = await api.get<SignatureResponse>("/cloudinary/signature", {
            params: { folderName }
        });
        return response.data;
    },
    uploadSingleImage: async (file: File, sig: SignatureResponse): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sig.api_key);
        formData.append("timestamp", sig.timestamp);
        formData.append("signature", sig.signature);
        formData.append("folder", sig.folder);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!res.ok) throw new Error("Upload to Cloudinary failed");
        return await res.json()
    }
};