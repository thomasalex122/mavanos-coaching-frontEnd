"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '../lib/api';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT"); 
  const [error, setError] = useState("");
  
  const router = useRouter();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post('/auth/register', {
        name: name,
        email: email,
        password: password,
        role: role,
      });

      // If registration is successful, navigate to the login page
      router.push("/login");
    } catch(err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] px-4 font-sans relative overflow-hidden">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors animate-fade-in-up z-20 font-medium bg-[#111111]/80 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md">
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </Link>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb bg-orb-blue w-80 h-80 -top-40 -left-40 absolute" />
        <div className="bg-orb bg-orb-purple w-64 h-64 -bottom-20 right-10 absolute" />
      </div>
      <div className="p-8 sm:p-10 bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-[440px] animate-scale-in relative z-10">
        
        {/* Header Section */}
        <h2 className="text-3xl font-bold mb-2 text-white tracking-tight animate-fade-in-up">Create Account</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed animate-fade-in-up delay-1">
          Join Mavano Sports and start your coaching journey today.
        </p>
        
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleRegister} className="space-y-5 animate-fade-in-up delay-2">
          
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600" 
              required
            />
          </div>

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
            <label className="block text-sm font-medium text-zinc-200 mb-2">Account Type</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
            >
              <option value="STUDENT">student</option>
              <option value="COACH">coach</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600" 
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 mt-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)] btn-glow btn-shine"
          >
            Create Account
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-zinc-400 animate-fade-in delay-3">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  );
}