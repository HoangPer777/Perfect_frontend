import LoginContent from "@/components/auth/LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f9fafb] relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-30" />
      
      <LoginContent />
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 tracking-widest hidden sm:flex">
        <span>© 2024 Aura Marketplace. Ethically Curated.</span>
        <div className="flex gap-6">
          <button className="hover:text-gray-600 transition-colors">Privacy</button>
          <button className="hover:text-gray-600 transition-colors">Terms</button>
          <button className="hover:text-gray-600 transition-colors">Support</button>
        </div>
      </div>
    </div>
  );
}
