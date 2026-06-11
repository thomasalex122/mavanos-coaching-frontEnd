"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from '../lib/api'; // Our Axios Gateway

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. The Knock: Send credentials to NestJS
      const response = await api.post("/auth/login", { 
        email: email, 
        password: password 
      });

      // 2. The Safe: Save BOTH the wristband (token) AND the receipt (user data)
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // 3. The Traffic Cop: Read the role straight from the receipt!
      const userRole = response.data.user.role;
      
      if (userRole === 'COACH') {
        router.push('/coach-dashboard');
      } else {
        router.push('/student-dashboard');
      }

    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="p-8 bg-white rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Welcome Back</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
            />
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}