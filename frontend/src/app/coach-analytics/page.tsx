"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, BarChart2 } from "lucide-react";
import api from "../lib/api";

export default function CoachAnalytics() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

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
      console.error("Failed to load classes for analytics", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const totalBookings = sessions.reduce((acc, s) => acc + (s.bookings?.length || 0), 0);
  const potentialRevenue = sessions.reduce((acc, s) => acc + ((s.bookings?.length || 0) * s.price), 0);
  const sortedSessions = [...sessions].sort((a, b) => (b.bookings?.length || 0) - (a.bookings?.length || 0));

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <div className="spinner-lg" />
      <span className="text-zinc-500 font-medium">Loading analytics...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-white pb-20">
      {/* Navbar */}
      <nav className="bg-blue-600 px-6 py-3 flex items-center justify-between shadow-md animate-slide-down">
        <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-white text-blue-600 rounded flex items-center justify-center text-lg">M</div>
          Mavano Sports
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/coach-dashboard" className="px-4 py-2 rounded-lg text-white/70 hover:text-white transition-colors">My Sessions</Link>
          <Link href="/coach-analytics" className="px-4 py-2 rounded-lg bg-white/20 text-white transition-colors">Analytics</Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div className="hidden md:block text-sm text-right">
            <div className="font-semibold leading-tight">{user?.name || 'Coach'}</div>
            <div className="text-white/70 text-xs text-right pr-1">Coach</div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="mb-10 border-b border-zinc-800 pb-8 flex justify-between items-end animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome, Coach {user?.name ? user.name.split(' ')[0] : ''}!</h1>
            <p className="text-zinc-400">View your performance and revenue insights</p>
          </div>
        </div>

        {/* Sub-menu Navigation */}
        <div className="flex gap-8 mb-8 border-b border-zinc-800 animate-fade-in-up delay-1">
          <Link href="/coach-dashboard" className="flex items-center gap-2 font-medium pb-4 border-b-2 text-zinc-500 border-transparent hover:text-zinc-300 transition-colors">
            <Plus size={18} className="rotate-45" /> My Sessions
            <span className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-full ml-1">{sessions.length}</span>
          </Link>
          <Link href="/coach-analytics" className="flex items-center gap-2 font-medium pb-4 border-b-2 text-blue-500 border-blue-500 transition-colors">
            <BarChart2 size={18} /> Analytics
          </Link>
        </div>

        {/* ANALYTICS VIEW */}
        <div className="animate-in fade-in duration-500">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in-up delay-2">
            <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6 card-hover">
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Sessions</h3>
              <p className="text-4xl font-bold text-white mb-2">{sessions.length}</p>
              <p className="text-xs text-zinc-500">Sessions you've created</p>
            </div>
            <div className="bg-[#111111] border border-blue-900/30 rounded-xl p-6 card-hover">
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Total Bookings</h3>
              <p className="text-4xl font-bold text-blue-500 mb-2">{totalBookings}</p>
              <p className="text-xs text-zinc-500">Students enrolled</p>
            </div>
            <div className="bg-[#111111] border border-green-900/30 rounded-xl p-6 card-hover">
              <h3 className="text-zinc-400 text-sm font-medium mb-2">Potential Revenue</h3>
              <p className="text-4xl font-bold text-green-500 mb-2">₹{potentialRevenue}</p>
              <p className="text-xs text-zinc-500">From current bookings</p>
            </div>
          </div>

          {/* Middle Section: Top Performers & Revenue Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fade-in-up delay-3">
            <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6 card-hover">
              <h3 className="text-xl font-bold mb-6">Top Performing Sessions</h3>
              <div className="space-y-6">
                {sortedSessions.slice(0, 3).map((session, index) => (
                  <div key={session.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold">{index + 1}</div>
                      <div>
                        <p className="font-bold text-sm">{session.title}</p>
                        <p className="text-xs text-zinc-500">Training • Standard</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{session.bookings?.length || 0}</p>
                      <p className="text-xs text-zinc-500">bookings</p>
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && <p className="text-sm text-zinc-500">No data available.</p>}
              </div>
            </div>

            <div className="bg-[#111111] border border-zinc-800 rounded-xl p-6 card-hover">
              <h3 className="text-xl font-bold mb-6">Revenue by Session</h3>
              <div className="space-y-6">
                {sortedSessions.slice(0, 3).map(session => {
                  const revenue = (session.bookings?.length || 0) * session.price;
                  const maxRevenue = session.maxSlots * session.price;
                  const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={session.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold">{session.title}</span>
                        <span className="font-bold text-blue-500">₹{revenue}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-1">
                        <div className="bg-blue-600 h-2.5 rounded-full progress-bar-animated" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <p className="text-xs text-zinc-500">₹{session.price} x {session.bookings?.length || 0} bookings</p>
                    </div>
                  );
                })}
                 {sessions.length === 0 && <p className="text-sm text-zinc-500">No data available.</p>}
              </div>
            </div>
          </div>

          {/* Bottom Table: Session Details */}
          <div className="bg-[#111111] border border-zinc-800 rounded-xl overflow-hidden animate-fade-in-up delay-4">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-xl font-bold">Session Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="text-xs uppercase bg-[#1a1a1a] border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-zinc-300">Session</th>
                    <th className="px-6 py-4 font-semibold text-zinc-300">Sport</th>
                    <th className="px-6 py-4 font-semibold text-zinc-300">Level</th>
                    <th className="px-6 py-4 font-semibold text-zinc-300">Bookings</th>
                    <th className="px-6 py-4 font-semibold text-zinc-300">Price</th>
                    <th className="px-6 py-4 font-semibold text-zinc-300">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(session => (
                    <tr key={session.id} className="border-b border-zinc-800 hover:bg-[#161616] transition-colors row-hover">
                      <td className="px-6 py-4 font-medium text-zinc-200">{session.title}</td>
                      <td className="px-6 py-4">TBD</td>
                      <td className="px-6 py-4"><span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full text-xs">Standard</span></td>
                      <td className="px-6 py-4">{session.bookings?.length || 0}/{session.maxSlots}</td>
                      <td className="px-6 py-4">₹{session.price}</td>
                      <td className="px-6 py-4 font-bold text-blue-500">₹{(session.bookings?.length || 0) * session.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}