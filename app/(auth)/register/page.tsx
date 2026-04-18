"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [role, setRole] = useState("CUSTOMER");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log("Registering as:", role);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 border rounded-xl shadow-lg w-full max-w-md bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-4 justify-center mb-4">
            <button 
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`px-4 py-2 rounded ${role === "CUSTOMER" ? "bg-primary text-white" : "border"}`}
            >
              Customer
            </button>
            <button 
              type="button"
              onClick={() => setRole("DESIGNER")}
              className={`px-4 py-2 rounded ${role === "DESIGNER" ? "bg-primary text-white" : "border"}`}
            >
              Designer
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="johndoe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full p-2 border rounded" placeholder="name@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full p-2 border rounded" placeholder="••••••••" />
          </div>
          
          <button className="w-full bg-primary text-white p-2 rounded font-bold hover:opacity-90">
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}
