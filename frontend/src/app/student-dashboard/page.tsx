"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Heart, Filter, Calendar, Clock, MapPin, Users, LogOut } from "lucide-react";
import api from "../lib/api";

export default function StudentDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name?: string; email?: string; id?: number } | null>(null);
  
  // Navigation & Filters
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>('browse');
  const [filterSport, setFilterSport] = useState("All Sports");
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [isBooking, setIsBooking] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "STUDENT") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch ALL available sessions and the student's specific bookings at the same time
      const [sessionsRes, bookingsRes] = await Promise.all([
        api.get('/sessions'), // Make sure this endpoint exists in your sessions controller!
        api.get('/bookings/my-schedule')
      ]);
      
      setSessions(sessionsRes.data);
      setMyBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
      setError("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (sessionId: number) => {
    setIsBooking(sessionId);
    try {
      await api.post(`/bookings/${sessionId}`);
      await fetchData(); // Refresh data to update "spots filled" and "Already Booked" status
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to book the session.");
    } finally {
      setIsBooking(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Helper arrays for identifying what is booked
  const bookedSessionIds = new Set(myBookings.map((b: any) => b.sessionId));

  // Filter Logic
  const filteredSessions = sessions.filter(session => {
    const matchSport = filterSport === "All Sports" || session.sport === filterSport;
    const matchLocation = filterLocation === "All Locations" || session.location === filterLocation;
    return matchSport && matchLocation;
  });

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4"><div className="spinner-lg" /><span className="text-zinc-500 font-medium">Loading your dashboard...</span></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white pb-20 relative">
      
      {/* 1. Navbar (Cleaned up, no middle links) */}
      <nav className="bg-blue-600 px-6 py-3 flex items-center justify-between shadow-md animate-slide-down">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-white text-blue-600 rounded flex items-center justify-center text-lg">M</div>
          Mavano Sports
        </div>
        
        {/* Empty middle space */}
        <div className="hidden md:flex"></div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="hidden md:block text-sm text-right">
            <div className="font-semibold leading-tight">{user?.name || 'User'}</div>
            <div className="text-white/70 text-xs text-right pr-1">Student</div>
          </div>
          <button onClick={handleLogout} className="ml-2 p-2 text-zinc-300 hover:text-white bg-blue-700/50 hover:bg-blue-700 rounded-full transition-colors" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* 2. Main Content Container */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        
        {/* Header */}
        <div className="mb-10 relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl animate-fade-in-up bg-[#111111] min-h-[220px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img src="/kids-sports.png" alt="Student Hero" className="w-full h-full object-cover opacity-50 mix-blend-screen object-top" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
          </div>
          <div className="relative z-10 p-8 md:p-12 w-full flex flex-col justify-center items-start">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-bold rounded-full mb-4 animate-fade-in-up delay-1">Student Portal</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-white animate-fade-in-up delay-2">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}!
              </h1>
              <p className="text-zinc-400 text-lg animate-fade-in-up delay-3">
                Ready to level up? Browse elite coaching sessions and master your sport today.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Sub-menu Tabs */}
        <div className="flex gap-8 mb-8 border-b border-zinc-800 animate-fade-in-up delay-1">
          <button onClick={() => setActiveTab('browse')} className={`flex items-center gap-2 font-medium pb-4 border-b-2 transition-colors ${activeTab === 'browse' ? 'text-blue-500 border-blue-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>
            <BookOpen size={18} /> Browse Sessions
          </button>
          <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-2 font-medium pb-4 border-b-2 transition-colors ${activeTab === 'bookings' ? 'text-blue-500 border-blue-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>
            <Heart size={18} /> My Bookings
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">{myBookings.length}</span>
          </button>
        </div>

        {/* Global Error */}
        {error && <div className="mb-6 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg">{error}</div>}

        {/* 4. Browse Sessions View */}
        {activeTab === 'browse' && (
          <div>
            {/* Filters Box */}
            <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6 mb-8 animate-fade-in-up delay-2">
              <div className="flex items-center gap-2 font-bold mb-4">
                <Filter size={18} className="text-blue-500" /> Filter Sessions
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Sport</label>
                  <select value={filterSport} onChange={(e) => setFilterSport(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all cursor-pointer">
                    <option value="All Sports">All Sports</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Cricket">Cricket</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Location</label>
                  <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all cursor-pointer">
                    <option value="All Locations">All Locations</option>
                    <option value="Koramangala Sports Complex">Koramangala Sports Complex</option>
                    <option value="Indiranagar Badminton Court">Indiranagar Badminton Court</option>
                    <option value="Kanteerava Stadium">Kanteerava Stadium</option>
                    <option value="HSR Layout Sports Club">HSR Layout Sports Club</option>
                    <option value="Cubbon Park Tennis Academy">Cubbon Park Tennis Academy</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sessions Grid */}
            {filteredSessions.length === 0 ? (
              <div className="p-16 border border-zinc-800 rounded-2xl text-center flex flex-col items-center bg-[#111111] animate-fade-in shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
                <div className="w-56 h-56 relative mb-6 animate-float z-10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.15)] border border-zinc-800">
                   <img src="/coach-hero.png" alt="No classes found" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 z-10">No Sessions Found</h3>
                <p className="text-zinc-400 max-w-md z-10 text-lg">We couldn't find any coaching sessions matching your current filters. Try adjusting your search to discover more classes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.map((session) => {
                  const spotsFilled = session.bookings?.length || 0;
                  const spotsAvailable = session.maxSlots - spotsFilled;
                  const isBooked = bookedSessionIds.has(session.id);
                  const isFull = spotsFilled >= session.maxSlots;

                  return (
                    <div key={session.id} className="bg-[#111111] border border-zinc-800 rounded-xl p-6 flex flex-col hover:border-zinc-700 transition-colors card-hover animate-fade-in-up">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold leading-tight pr-4">{session.title}</h3>
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">Standard</span>
                      </div>
                      
                      <p className="text-zinc-500 text-sm mb-4">{session.sport}</p>
                      <p className="text-zinc-300 text-sm mb-6 line-clamp-2 flex-grow">{session.description}</p>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-sm text-zinc-400"><Calendar size={16} className="text-zinc-500" />{formatDate(session.date)}</div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400"><Clock size={16} className="text-zinc-500" />{session.timeSlot}</div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400"><MapPin size={16} className="text-zinc-500" />{session.location}</div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                          <Users size={16} className="text-zinc-500" />
                          <span><strong className="text-zinc-200">{spotsFilled}/{session.maxSlots}</strong> spots filled ({spotsAvailable} available)</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-800">
                        <div className="text-xl font-bold text-blue-500">₹{session.price}</div>
                        
                        {/* Dynamic Button Logic */}
                        {isBooked ? (
                          <button disabled className="bg-green-900/30 text-green-600 border border-green-900/50 px-5 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
                            Already Booked
                          </button>
                        ) : isFull ? (
                          <button disabled className="bg-zinc-800 text-zinc-500 px-5 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
                            Full
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBookSession(session.id)}
                            disabled={isBooking === session.id}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 btn-glow"
                          >
                            {isBooking === session.id ? 'Booking...' : 'Book Session'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. My Bookings View */}
        {activeTab === 'bookings' && (
          <div>
            {myBookings.length === 0 ? (
              <div className="p-16 border border-zinc-800 rounded-2xl text-center flex flex-col items-center bg-[#111111] animate-fade-in shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none"></div>
                <div className="w-56 h-56 relative mb-6 animate-float z-10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.15)] border border-zinc-800">
                   <img src="/kids-sports.png" alt="No bookings" className="w-full h-full object-cover grayscale opacity-70" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 z-10">No Bookings Yet</h3>
                <p className="text-zinc-400 max-w-md mb-8 z-10 text-lg">You haven't scheduled any training yet. Head over to the Browse tab to find the perfect coach and secure your spot!</p>
                <button onClick={() => setActiveTab('browse')} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 btn-glow btn-shine transition-colors z-10 shadow-lg">
                  <BookOpen size={18} /> Browse Sessions
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBookings.map((booking) => {
                  const session = booking.session; // Extract the nested session data
                  if (!session) return null;

                  return (
                    <div key={booking.id} className="bg-[#111111] border border-zinc-800 rounded-xl p-6 flex flex-col card-hover animate-fade-in-up">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold leading-tight pr-4">{session.title}</h3>
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">Confirmed</span>
                      </div>
                      <p className="text-zinc-500 text-sm mb-4">{session.sport}</p>
                      
                      <div className="space-y-3 mb-6 bg-[#0a0a0a] p-4 rounded-lg border border-zinc-800/50">
                        <div className="flex items-center gap-3 text-sm text-zinc-400"><Calendar size={16} className="text-zinc-500" />{formatDate(session.date)}</div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400"><Clock size={16} className="text-zinc-500" />{session.timeSlot}</div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400"><MapPin size={16} className="text-zinc-500" />{session.location}</div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-800">
                        <div className="text-sm text-zinc-400">Paid: <strong className="text-zinc-200">₹{session.price}</strong></div>
                        <button disabled className="bg-green-900/30 text-green-600 border border-green-900/50 px-5 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
                          Already Booked
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}