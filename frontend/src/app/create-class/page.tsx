"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function CreateClassPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [sport, setSport] = useState("Tennis");
  const [location, setLocation] = useState("Koramangala Sports Complex");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 11:00 AM");
  const [maxSlots, setMaxSlots] = useState("10"); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};

    if (!token || user.role !== "COACH") {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post('/sessions', {
        title: title,
        description: description,
        sport: sport,
        location: location,
        timeSlot: timeSlot,
        price: parseFloat(price), 
        date: new Date(date).toISOString(), 
        maxSlots: parseInt(maxSlots), 
      });
      router.push('/coach-dashboard');
    } catch (err: any) {
      const realErrorMessage = err.response?.data?.message || "Failed to create class.";
      setError(Array.isArray(realErrorMessage) ? realErrorMessage.join(", ") : realErrorMessage);
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <div className="spinner-lg" />
        <span className="text-zinc-500 font-medium">Verifying Coach Access...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb bg-orb-blue w-80 h-80 -top-40 -right-40 absolute" />
        <div className="bg-orb bg-orb-purple w-64 h-64 bottom-20 -left-32 absolute" />
      </div>

      <div className="bg-[#111111] p-8 rounded-xl border border-zinc-800 w-full max-w-xl animate-scale-in relative z-10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white animate-fade-in-up">Create New Class</h2>
          <button onClick={() => router.push('/coach-dashboard')} className="text-sm text-zinc-500 hover:text-zinc-200">Cancel</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleCreate} className="space-y-4 animate-fade-in-up delay-1">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Class Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Morning Swim Practice" className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="What will students learn?" className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Sport</label>
              <select value={sport} onChange={(e) => setSport(e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer">
                <option value="Tennis">Tennis</option>
                <option value="Swimming">Swimming</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">Football</option>
                <option value="Badminton">Badminton</option>
                <option value="Yoga">Yoga</option>
                <option value="Gymnastics">Gymnastics</option>
                <option value="Martial Arts">Martial Arts</option>
                <option value="Table Tennis">Table Tennis</option>
                <option value="Golf">Golf</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer">
                <option value="Koramangala Sports Complex">Koramangala Sports Complex</option>
                <option value="Indiranagar Badminton Court">Indiranagar Badminton Court</option>
                <option value="Kanteerava Stadium">Kanteerava Stadium</option>
                <option value="HSR Layout Sports Club">HSR Layout Sports Club</option>
                <option value="Cubbon Park Tennis Academy">Cubbon Park Tennis Academy</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all [color-scheme:dark]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Time Slot</label>
              <input type="text" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} placeholder="e.g. 10:00 AM - 11:30 AM" className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Max Students</label>
              <input type="number" value={maxSlots} onChange={(e) => setMaxSlots(e.target.value)} min="1" className="w-full px-4 py-2 bg-[#0a0a0a] text-white border border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-zinc-600" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 btn-glow btn-shine">
            {loading ? "Publishing..." : "Publish Class"}
          </button>
        </form>
      </div>
    </div>
  );
}