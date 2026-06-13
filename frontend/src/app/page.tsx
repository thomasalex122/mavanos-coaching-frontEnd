"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
    }
  }, []);

  const handleDashboardRedirect = () => {
    if (userRole === 'COACH') router.push('/coach-dashboard');
    else if (userRole === 'STUDENT') router.push('/student-dashboard');
    else router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <header className="w-full bg-[#0a0a0a]/80 border-b border-zinc-800 nav-glass animate-slide-down py-4 px-8 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
          Mavanos<span className="text-white">Coaching</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/classes" className="text-zinc-400 hover:text-blue-400 font-medium transition">
            Browse Classes
          </Link>
          {userRole ? (
            <button onClick={handleDashboardRedirect} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 btn-glow transition">
              Go to Dashboard
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => router.push('/login')} className="px-5 py-2 text-zinc-300 font-semibold hover:bg-zinc-800 rounded-lg transition">
                Log In
              </button>
              <button onClick={() => router.push('/register')} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm btn-glow">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb bg-orb-blue w-96 h-96 -top-48 -left-48 absolute" />
        <div className="bg-orb bg-orb-purple w-96 h-96 -bottom-48 -right-48 absolute" />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-4xl">
          Master your craft with <br className="hidden md:block" />
          <span className="gradient-text">expert coaching.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl">
          Whether you are looking to perfect your freestyle swimming, learn advanced coding techniques, or master a new instrument, find the perfect coach to guide your journey.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button onClick={() => router.push('/classes')} className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition shadow-lg hover:-translate-y-0.5 btn-glow btn-shine">
            Find a Class
          </button>
          {!userRole && (
            <button onClick={() => router.push('/register')} className="px-8 py-4 bg-zinc-900 text-zinc-300 border-2 border-zinc-700 text-lg font-bold rounded-xl hover:bg-zinc-800 transition">
              Become a Coach
            </button>
          )}
        </div>
      </main>

      <section className="bg-[#111111] py-20 px-8 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in-up">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center animate-fade-in-up delay-2">
            <div className="p-6 card-hover rounded-xl bg-[#0a0a0a] border border-zinc-800">
              <div className="w-16 h-16 mx-auto bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-bold text-white mb-2">Discover</h3>
              <p className="text-zinc-400">Browse our storefront to find classes that fit your exact goals.</p>
            </div>
            <div className="p-6 card-hover rounded-xl bg-[#0a0a0a] border border-zinc-800">
              <div className="w-16 h-16 mx-auto bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-bold text-white mb-2">Book</h3>
              <p className="text-zinc-400">Secure your slot instantly. Our platform handles the scheduling.</p>
            </div>
            <div className="p-6 card-hover rounded-xl bg-[#0a0a0a] border border-zinc-800">
              <div className="w-16 h-16 mx-auto bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-bold text-white mb-2">Master</h3>
              <p className="text-zinc-400">Connect with your coach and take your skills to the next level.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full bg-slate-900 py-8 text-center text-zinc-500 border-t border-zinc-800">
        <p>&copy; {new Date().getFullYear()} Mavanos Coaching. All rights reserved.</p>
      </footer>
    </div>
  );
}