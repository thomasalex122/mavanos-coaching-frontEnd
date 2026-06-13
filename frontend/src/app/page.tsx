"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

// this function automatically runs once the page finishes loading 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
      
    }
  }, []); // [] means runs once on page load

  const handleDashboardRedirect = () => {
    if (userRole === 'COACH') router.push('/coach-dashboard');
    else if (userRole === 'STUDENT') router.push('/student-dashboard');
    else router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
          Mavanos<span className="text-slate-800">Coaching</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/classes" className="text-slate-600 hover:text-blue-600 font-medium transition">
            Browse Classes
          </Link>
          {//  below is conditional rendering - if userRole exists, show dashboard button, otherwise show login/signup buttons
}
          {userRole ? (
            <button onClick={handleDashboardRedirect} className="px-5 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition">
              Go to Dashboard
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => router.push('/login')} className="px-5 py-2 text-slate-700 font-semibold hover:bg-slate-100 rounded-lg transition">
                Log In
              </button>
              <button onClick={() => router.push('/register')} className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight max-w-4xl">
          Master your craft with <br className="hidden md:block" />
          <span className="text-blue-600">expert coaching.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl">
          Whether you are looking to perfect your freestyle swimming, learn advanced coding techniques, or master a new instrument, find the perfect coach to guide your journey.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button onClick={() => router.push('/classes')} className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl hover:bg-blue-700 transition shadow-lg hover:-translate-y-0.5">
            Find a Class
          </button>
          {!userRole && (
            <button onClick={() => router.push('/register')} className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 text-lg font-bold rounded-xl hover:bg-slate-50 transition">
              Become a Coach
            </button>
          )}
        </div>
      </main>

      <section className="bg-white py-20 px-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Discover</h3>
              <p className="text-slate-600">Browse our storefront to find classes that fit your exact goals.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Book</h3>
              <p className="text-slate-600">Secure your slot instantly. Our platform handles the scheduling.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Master</h3>
              <p className="text-slate-600">Connect with your coach and take your skills to the next level.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full bg-slate-900 py-8 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} Mavanos Coaching. All rights reserved.</p>
      </footer>
    </div>
  );
}