"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function CreateClassPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [maxSlots, setMaxSlots] = useState("10"); // Added state for Max Students
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // The Knock: Sending all the exact fields your DTO requires
      await api.post('/sessions', {
        title: title,
        description: description,
        price: parseFloat(price), 
        date: new Date(date).toISOString(), 
        maxSlots: parseInt(maxSlots), // Converted to integer for Prisma
      });

      router.push('/coach-dashboard');

    } catch (err: any) {
      console.error("THE REAL ERROR:", err.response?.data);
      const realErrorMessage = err.response?.data?.message || "Failed to create class.";
      
      if (Array.isArray(realErrorMessage)) {
        setError(realErrorMessage.join(", "));
      } else {
        setError(realErrorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Create New Class</h2>
          <button 
            onClick={() => router.push('/coach-dashboard')}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Class Title</label>
            <input 
              type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acoustic Fingerstyle Basics"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What will students learn?"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
              <input 
                type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                min="0" step="0.01"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
              />
            </div>
            {/* THE NEW MAX SLOTS BOX */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Students</label>
              <input 
                type="number" value={maxSlots} onChange={(e) => setMaxSlots(e.target.value)}
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
              <input 
                type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md disabled:bg-blue-300"
          >
            {loading ? "Publishing..." : "Publish Class"}
          </button>
        </form>
      </div>
    </div>
  );
}