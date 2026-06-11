"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function StudentDashboard() {
  // 1. State to hold the student's booked classes
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const router = useRouter();

  // 2. Fetch the data the moment the page loads
  useEffect(() => {
    const fetchMySchedule = async () => {
      try {
        // Axios attaches the Student's token automatically
        const response = await api.get('/sessions/my-schedule');
        setSchedule(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch schedule", err);
        setError("Could not load your schedule. Please log in again.");
        setLoading(false);
        router.push('/login');
      }
    };

    fetchMySchedule();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-slate-500">Loading your schedule...</div>;
  }

  // 3. The Student UI!
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900">My Schedule</h1>
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

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Classes You've Booked</h2>

        {schedule.length === 0 ? (
          <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
            You haven't booked any classes yet. Time to start learning!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Loop through the bookings NestJS sent us */}
            {schedule.map((booking) => (
              <div key={booking.id} className="p-6 bg-white rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition flex flex-col">
                
                {/* Notice we have to dig into booking.session because of how Prisma returned the data! */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{booking.session.title}</h3>
                </div>
                
                <p className="text-slate-600 text-sm mb-4 flex-grow">{booking.session.description}</p>
                
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm font-semibold text-slate-700">
                    Coach: <span className="text-blue-600">{booking.session.coach.name}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Contact: {booking.session.coach.email}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}