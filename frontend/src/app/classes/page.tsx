"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api"; // Our Axios Gateway

export default function ClassesPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // We need to know who is looking at the page to determine what the button should do
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // We track exactly which class is being booked to show a spinner on THAT specific button
  const [bookingId, setBookingId] = useState<number | null>(null);

  const router = useRouter();

  // 1. On Page Load: Fetch all classes and check who is logged in
  useEffect(() => {
    // Check local storage for identity
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
    }

    // Fetch the storefront data
    const fetchAllClasses = async () => {
      try {
        const response = await api.get('/sessions');
        setSessions(response.data);
      } catch (err) {
        console.error("Failed to load classes", err);
        setError("Could not connect to the database to load classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllClasses();
  }, []);

  // 2. The Action: What happens when they click "Book"
  const handleBook = async (sessionId: number) => {
    // Security layer 1: Are they even logged in?
    if (!userRole) {
      router.push('/login');
      return;
    }

    // Security layer 2: Are they a Coach? (Coaches can't book classes)
    if (userRole === 'COACH') {
      alert("You are logged in as a Coach. Only Students can book classes.");
      return;
    }

    // Lock the button and start the booking process
    setBookingId(sessionId);
    setError("");

    try {
      // Send the request. Axios will automatically attach the Student's JWT token!
      await api.post(`/sessions/${sessionId}/book`);
      
      // If NestJS says "Success", teleport the student to their dashboard to see the receipt
      router.push('/student-dashboard');

    } catch (err: any) {
      console.error("Booking failed:", err.response?.data);
      const realErrorMessage = err.response?.data?.message || "Failed to book the class.";
      setError(`Booking Error: ${realErrorMessage}`);
    } finally {
      // Unlock the button
      setBookingId(null);
    }
  };

  // 3. UI: Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <div className="spinner-lg" />
        <span className="text-zinc-500 font-medium">Loading available classes...</span>
      </div>
    );
  }

  // 4. UI: The Main Storefront
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            {/* UPDATED: Universal, subject-agnostic headers */}
            <h1 className="text-4xl font-extrabold text-white animate-fade-in-up">Available Classes</h1>
            <p className="text-zinc-400 mt-2 animate-fade-in-up delay-1">Find a coach and book your next session.</p>
          </div>
          
          {/* Dynamic Navigation Button based on who is logged in */}
          <button 
            onClick={() => {
              if (userRole === 'COACH') router.push('/coach-dashboard');
              else if (userRole === 'STUDENT') router.push('/student-dashboard');
              else router.push('/login');
            }}
            className="px-5 py-2 bg-zinc-800 text-zinc-200 font-semibold rounded-lg hover:bg-zinc-700 border border-zinc-700 transition"
          >
            {userRole ? "Go to Dashboard" : "Log In"}
          </button>
        </div>

        {/* Global Error Banner */}
        {error && <div className="mb-6 p-4 bg-red-500/10 text-red-400 border border-red-500/20 text-sm rounded-lg font-medium">{error}</div>}

        {sessions.length === 0 ? (
          <div className="p-12 bg-[#111111] rounded-xl border border-zinc-800 text-center text-zinc-500">
            No classes are currently available. Please check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Loop through every class in the database */}
            {sessions.map((session) => (
              <div key={session.id} className="p-6 bg-[#111111] rounded-xl border border-zinc-800 card-hover animate-fade-in-up transition-shadow flex flex-col relative overflow-hidden">
                
                {/* Price Tag Badge */}
                <div className="absolute top-4 right-4 bg-green-500/10 text-green-400 border border-green-500/20 font-extrabold px-3 py-1 rounded-full text-sm">
                  ${session.price}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 pr-16">{session.title}</h3>
                
                {/* Convert the ugly ISO date into a nice readable format */}
                <p className="text-blue-400 text-sm font-semibold mb-4">
                  {new Date(session.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>

                <p className="text-zinc-400 text-sm mb-6 flex-grow">{session.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <div className="text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-300">{session.maxSlots}</span> slots max
                  </div>
                  
                  <button 
                    onClick={() => handleBook(session.id)}
                    disabled={bookingId === session.id} // Disable ONLY this button if it's loading
                    className={`px-6 py-2 text-white font-semibold rounded-lg transition shadow-sm 
                      ${userRole === 'COACH' ? 'bg-zinc-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 btn-glow'}
                      ${bookingId === session.id ? 'opacity-75 cursor-wait' : ''}
                    `}
                  >
                    {bookingId === session.id ? 'Booking...' : (userRole === 'COACH' ? 'Coach View' : 'Book Now')}
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}