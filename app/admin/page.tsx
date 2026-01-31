"use client";

import { useEffect, useState } from "react";
import { Users, Award, Clock, TrendingUp, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedCertificates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API Call to fetch stats
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin"/> Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, Administrator.</p>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         
         {/* Card 1: Students */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
               <Users size={24} />
            </div>
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Students</p>
               <h3 className="text-2xl font-bold text-slate-800">{stats.totalStudents}</h3>
            </div>
         </div>

         {/* Card 2: Pending Requests (Important) */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
               <Clock size={24} />
            </div>
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Pending Review</p>
               <h3 className="text-2xl font-bold text-slate-800">{stats.pendingRequests}</h3>
            </div>
         </div>

         {/* Card 3: Certificates Issued */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
               <Award size={24} />
            </div>
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Certificates Given</p>
               <h3 className="text-2xl font-bold text-slate-800">{stats.approvedCertificates}</h3>
            </div>
         </div>

         {/* Card 4: Total Revenue (Dummy for now) */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
               <TrendingUp size={24} />
            </div>
            <div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Revenue</p>
               <h3 className="text-2xl font-bold text-slate-800">$0.00</h3>
            </div>
         </div>
      </div>

      {/* --- QUICK ACTIONS SECTION --- */}
      <div className="bg-[#082F49] rounded-3xl p-8 text-white relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Manage Your Institute</h2>
            <p className="text-blue-200 mb-6 max-w-xl">
               You have <strong className="text-white">{stats.pendingRequests} pending requests</strong> waiting for approval. 
               Review them to ensure students receive their certificates on time.
            </p>
            <a href="/admin/certificates" className="bg-white text-[#082F49] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-block">
               Go to Requests
            </a>
         </div>
         {/* Background Decoration */}
         <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
         <Award className="absolute -right-6 -bottom-6 text-white/5 w-64 h-64 rotate-12" />
      </div>

    </div>
  );
}