"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function CoachDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const response = await api.get('/sessions/my-classes');
        setClasses(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch classes", err);
        setError("Could not load your classes. Please log in again.");
        setLoading(false);
        router.push('/login'); 
      }
    };

    fetchMyClasses();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-slate-500">Loading your roster...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section WITH THE NEW BUTTON */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900">Coach Dashboard</h1>
          
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/create-class')}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition shadow-sm"
            >
              + Create Class
            </button>
            <button 
              onClick={() => {
                localStorage.clear(); 
                router.push('/');     
              }}
              className="px-4 py-2 bg-red-100 text-red-600 font-semibold rounded hover:bg-red-200 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Upcoming Classes</h2>

        {classes.length === 0 ? (
          <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
            You haven't created any classes yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((session) => (
              <div key={session.id} className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-blue-600">{session.title}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                    ${session.price}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 flex-grow">{session.description}</p>
                
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    Booked Students ({session.bookings?.length || 0}):
                  </p>
                  
                  {session.bookings?.length > 0 ? (
                    <ul className="space-y-1">
                      {session.bookings.map((booking: any) => (
                        <li key={booking.id} className="text-sm text-slate-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {booking.user.name} ({booking.user.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No students booked yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}