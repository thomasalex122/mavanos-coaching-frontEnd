// tells next.js that this is a client component

"use client";

import { useState } from 'react' ;
import { useRouter } from 'next/navigation';
import api from '../lib/api';


export default function RegisterPage()
{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT"); 
    const [error, setError] = useState("");
    
    const router = useRouter();
    
    // Activates when register is clicked
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try{
            await api.post('/auth/register', {
                name: name,
                email: email,
                password: password,
                role: role,

            });

            // if registration is successful, navigate to the login page
            router.push("/login");
        
        }catch(err: any)
        {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        }
    };

    
    return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="p-8 bg-white rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Create an Account</h2>
        
        {/* If there is an error from the backend, this red box appears */}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
            <select 
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none bg-white"
            >
              <option value="STUDENT">Student</option>
              <option value="COACH">Coach</option>
            </select>
          </div>

          <button type="submit" className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
