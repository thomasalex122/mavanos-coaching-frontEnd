"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react"; // Assuming you have lucide-react installed from v0
import api from '../lib/api'; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Controls the eye icon
  
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
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] px-4 font-sans relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors animate-fade-in-up z-20 font-medium bg-[#111111]/80 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md">
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </Link>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb bg-orb-blue w-80 h-80 -top-40 -right-40 absolute" />
        <div className="bg-orb bg-orb-purple w-64 h-64 bottom-20 -left-32 absolute" />
      </div>
      <div className="p-8 sm:p-10 bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-[400px] animate-scale-in relative z-10">
        
        {/* Header Section */}
        <h2 className="text-3xl font-bold mb-2 text-white tracking-tight animate-fade-in-up">Sign In</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed animate-fade-in-up delay-1">
          Welcome back to Mavano Sports. Sign in to your account.
        </p>
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-5 animate-fade-in-up delay-2">
          
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600 pr-12" 
                required
              />
              {/* Toggle Password Visibility Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 mt-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)] btn-glow btn-shine"
          >
            Sign In
          </button>
        </form>

        {/* Optional Footer Link to align with Register Page */}
        <p className="mt-8 text-center text-sm text-zinc-400 animate-fade-in delay-3">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}