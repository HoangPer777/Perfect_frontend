"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic with JWT store
    console.log("Login with:", email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 border rounded-xl shadow-lg w-full max-w-md bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Perfect Market</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-primary text-white p-2 rounded font-bold hover:opacity-90">
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {/* TODO: Implement Social Logins */}
          <p className="mb-2 text-muted-foreground">Or continue with</p>
          <div className="flex gap-4 justify-center">
            <button className="p-2 border rounded">Google</button>
            <button className="p-2 border rounded">Facebook</button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}
