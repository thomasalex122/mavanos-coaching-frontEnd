"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, MapPin, Users, Plus, BarChart2, X, LogOut } from "lucide-react";
import api from "../lib/api";

export default function CoachDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState("Tennis");
  const [location, setLocation] = useState("Koramangala Sports Complex");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10-11 hrs");
  const [maxCapacity, setMaxCapacity] = useState("8");
  const [price, setPrice] = useState("1000");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "COACH") {
      router.push("/login");
      return;
    }

    setUser(parsedUser);
    fetchMyClasses();
  }, [router]);

  const fetchMyClasses = async () => {
    try {
      const response = await api.get('/sessions/my-classes');
      setSessions(response.data);
    } catch (err) {
      setError("Could not load your classes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (sessionId: number) => {
    if (!window.confirm("Are you sure you want to delete this class? This will also cancel any student bookings.")) return;
    try {
      await api.delete(`/sessions/${sessionId}`);
      setSessions(sessions.filter((c: any) => c.id !== sessionId));
    } catch (err) {
      alert("Failed to delete the class.");
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.post('/sessions', {
        title: title,
        description: description,
        sport: sport,
        location: location,
        timeSlot: timeSlot,
        price: parseFloat(price),
        date: new Date(date).toISOString(), 
        maxSlots: parseInt(maxCapacity),
      });
      setIsModalOpen(false);
      resetForm();
      fetchMyClasses(); // Refresh the list to show the new class
    } catch (err: any) {
      alert("Failed to create class. Please check your inputs.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const resetForm = () => {
    setTitle(""); 
    setDescription(""); 
    setDate(""); 
    setMaxCapacity("8"); 
    setPrice("1000");
    setSport("Tennis");
    setLocation("Koramangala Sports Complex");
    setTimeSlot("10-11 hrs");
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white pb-20 relative">
      {/* Navbar */}
      <nav className="bg-blue-600 px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-white text-blue-600 rounded flex items-center justify-center text-lg">M</div>
          Mavano Sports
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/coach-dashboard" className="px-4 py-2 rounded-lg bg-white/20 text-white transition-colors">My Sessions</Link>
          <Link href="/coach-analytics" className="px-4 py-2 rounded-lg text-white/70 hover:text-white transition-colors">Analytics</Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="hidden md:block text-sm text-right">
            <div className="font-semibold leading-tight">{user?.name || 'Coach'}</div>
            <div className="text-white/70 text-xs text-right pr-1">Coach</div>
          </div>
          <button onClick={handleLogout} className="ml-2 p-2 text-zinc-300 hover:text-white bg-blue-700/50 hover:bg-blue-700 rounded-full transition-colors" title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="mb-10 border-b border-zinc-800 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome, Coach {user?.name ? user.name.split(' ')[0] : ''}!</h1>
            <p className="text-zinc-400">Create and manage your coaching sessions</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={18} /> Create Session
          </button>
        </div>

        {/* Sub-menu Navigation */}
        <div className="flex gap-8 mb-8 border-b border-zinc-800">
          <Link href="/coach-dashboard" className="flex items-center gap-2 font-medium pb-4 border-b-2 text-blue-500 border-blue-500 transition-colors">
            <Plus size={18} className="rotate-45" /> My Sessions
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">{sessions.length}</span>
          </Link>
          <Link href="/coach-analytics" className="flex items-center gap-2 font-medium pb-4 border-b-2 text-zinc-500 border-transparent hover:text-zinc-300 transition-colors">
            <BarChart2 size={18} /> Analytics
          </Link>
        </div>

        {/* Sessions Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Coaching Sessions</h2>
            <button onClick={() => setIsModalOpen(true)} className="sm:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus size={16} /> Create
            </button>
          </div>
          
          {sessions.length === 0 ? (
            <div className="p-12 border border-zinc-800 rounded-xl text-center text-zinc-500 bg-[#111111]">
              No sessions created yet. Click "Create Session" to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => {
                const spotsFilled = session.bookings?.length || 0;
                const spotsAvailable = session.maxSlots - spotsFilled;

                return (
                  <div key={session.id} className="bg-[#111111] border border-zinc-800 rounded-xl p-6 flex flex-col hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold leading-tight pr-4">{session.title}</h3>
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-1 rounded-full font-medium">Standard</span>
                    </div>
                    {/* Render Real Database Sport */}
                    <p className="text-zinc-500 text-sm mb-4">{session.sport || "Training"}</p>
                    
                    <p className="text-zinc-300 text-sm mb-6 line-clamp-2 flex-grow">{session.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <Calendar size={16} className="text-zinc-500" />
                        {formatDate(session.date)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <Clock size={16} className="text-zinc-500" />
                        {/* Render Real Database Time Slot */}
                        {session.timeSlot || "TBD"}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <MapPin size={16} className="text-zinc-500" />
                        {/* Render Real Database Location */}
                        {session.location || "Online"}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <Users size={16} className="text-zinc-500" />
                        <span><strong className="text-zinc-200">{spotsFilled}/{session.maxSlots}</strong> spots filled ({spotsAvailable} available)</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-800">
                      <div className="text-xl font-bold text-blue-500">₹{session.price}</div>
                      <button onClick={() => handleDeleteClass(session.id)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-[#111111] p-6 border-b border-zinc-800 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">Create New Session</h2>
                <p className="text-zinc-400 text-sm">Set up a new coaching session</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleCreateSession} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">Session Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Advanced Tennis Training" className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all placeholder:text-zinc-600" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-200 mb-2">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what this session covers..." rows={3} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all placeholder:text-zinc-600 resize-none" required />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-200 mb-2">Sport</label>
                    <select value={sport} onChange={(e) => setSport(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all cursor-pointer">
                      <option value="Tennis">Tennis</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Cricket">Cricket</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-200 mb-2">Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all cursor-pointer">
                      <option value="Koramangala Sports Complex">Koramangala Sports Complex</option>
                      <option value="Indiranagar Badminton Court">Indiranagar Badminton Court</option>
                      <option value="Kanteerava Stadium">Kanteerava Stadium</option>
                      <option value="HSR Layout Sports Club">HSR Layout Sports Club</option>
                      <option value="Cubbon Park Tennis Academy">Cubbon Park Tennis Academy</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-200 mb-2">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all [color-scheme:dark]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-200 mb-2">Time Slot</label>
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all cursor-pointer">
                      <option value="08-09 hrs">08-09 hrs</option>
                      <option value="10-11 hrs">10-11 hrs</option>
                      <option value="16-17 hrs">16-17 hrs</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-200 mb-2">Max Capacity</label>
                    <input type="number" min="1" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-200 mb-2">Price (₹)</label>
                    <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl outline-none focus:border-blue-600 transition-all" required />
                  </div>
                </div>

                {/* Preview Box */}
                <div className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-5 mt-6">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Preview</p>
                  <div className="space-y-1.5 text-sm">
                    <p><span className="text-zinc-400">Title:</span> <span className="font-semibold text-zinc-200">{title || "Not set"}</span></p>
                    <p><span className="text-zinc-400">Details:</span> <span className="text-zinc-300">{sport} • {location}</span></p>
                    <p><span className="text-zinc-400">Time:</span> <span className="text-zinc-300">{date ? formatDate(date) : "No date"} • {timeSlot}</span></p>
                    <p><span className="text-zinc-400">Price:</span> <span className="text-zinc-300">₹{price} per person • {maxCapacity} spots</span></p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex gap-4 justify-end">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-zinc-400 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={isCreating} className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50">
                    {isCreating ? "Creating..." : "Create Session"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}