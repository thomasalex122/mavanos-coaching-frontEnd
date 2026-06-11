import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Mavanos Coaching</h1>
      <p className="text-xl text-slate-600 mb-8">Master your craft with elite instructors.</p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Login
        </Link>
        <Link 
          href="/register" 
          className="px-6 py-3 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg hover:bg-slate-50 transition shadow-sm"
        >
          Register
        </Link>
      </div>
    </div>
  );
}