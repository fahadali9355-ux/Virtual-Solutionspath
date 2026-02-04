"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Award, Zap, ArrowRight, Loader2, PlayCircle, Calendar, PlusCircle, Search } from "lucide-react";

export default function DashboardOverview() {
  const [user, setUser] = useState({ name: "Student", email: "" });
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. LocalStorage se User Data lo
    const name = localStorage.getItem("userName") || "Student";
    const email = localStorage.getItem("userEmail");
    
    if (email) {
      setUser({ name, email });
      fetchMyCourses(email);
    } else {
      setLoading(false); 
    }
  }, []);

  // 2. API Call
  const fetchMyCourses = async (email: string) => {
    try {
      const res = await fetch("/api/my-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (data.courses) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. WELCOME BANNER */}
      <div className="relative bg-gradient-to-r from-[#082F49] to-[#0284C7] rounded-3xl p-8 md:p-10 text-white shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 text-blue-50 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
            Student Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-6">
            You have {courses.length > 0 ? <span>enrolled in <strong>{courses.length} courses</strong>.</span> : "not enrolled in any courses yet."} 
            Ready to learn something new today?
          </p>
          
          <div className="flex flex-wrap gap-4">
             {/* Continue Button */}
             {courses.length > 0 && (
               <Link href="/dashboard/courses" className="bg-white text-[#082F49] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2">
                  <PlayCircle size={20} /> Continue Learning
               </Link>
             )}

             {/* 👇 NEW: Browse Button (Ye hamesha show hoga) */}
             <Link href="/" className="bg-[#0C4A6E]/50 border border-white/30 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0C4A6E] transition-colors shadow-lg flex items-center gap-2 backdrop-blur-sm">
                <Search size={20} /> Browse New Courses
             </Link>
          </div>
        </div>

        {/* Background Decor */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
           <Zap size={250} className="-rotate-12 translate-x-10 translate-y-10" />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
           <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
             <BookOpen size={28} />
           </div>
           <div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Enrolled</p>
             <h3 className="text-3xl font-bold text-slate-800">{courses.length}</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
           <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
             <Award size={28} />
           </div>
           <div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed</p>
             <h3 className="text-3xl font-bold text-slate-800">0</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5">
           <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
             <Zap size={28} />
           </div>
           <div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Points</p>
             <h3 className="text-3xl font-bold text-slate-800">{courses.length * 10}</h3>
           </div>
        </div>
      </div>

      {/* 3. RECENT ACTIVITY / COURSES */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} /> Your Recent Courses
          </h2>
          {courses.length > 0 && (
            <Link href="/dashboard/courses" className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight size={16}/>
            </Link>
          )}
        </div>

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.slice(0, 4).map((course, index) => (
              <div key={index} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
                 
                 {/* Image */}
                 <div className="md:w-40 h-40 md:h-auto relative bg-slate-200 shrink-0">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={course.title} />
                 </div>

                 {/* Content */}
                 <div className="p-5 flex flex-col justify-center flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wide">
                          {course.category}
                       </span>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {course.desc}
                    </p>

                    <Link href={`/dashboard/courses`} className="mt-auto w-full">
                       <button className="w-full bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-bold group-hover:bg-[#082F49] group-hover:text-white transition-all flex items-center justify-center gap-2">
                          Resume Learning <ArrowRight size={14} />
                       </button>
                    </Link>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          // EMPTY STATE
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <BookOpen size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-800 mb-1">No courses found</h3>
             <p className="text-slate-500 mb-4 max-w-sm mx-auto text-sm">You haven't enrolled in any courses yet.</p>
          </div>
        )}
      </div>

      {/* 👇 4. NEW: EXPLORE MORE SECTION (Sabse Neeche) */}
      <div className="bg-[#F0F9FF] border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
               <PlusCircle size={32} />
            </div>
            <div>
               <h3 className="text-xl font-bold text-[#082F49]">Want to learn more skills?</h3>
               <p className="text-slate-600">Explore our catalog of top-rated courses and upgrade your career.</p>
            </div>
         </div>
         <Link href="/">
            <button className="bg-[#082F49] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/10 hover:bg-[#0C4A6E] transition-all flex items-center gap-2 whitespace-nowrap">
               Explore Courses <ArrowRight size={18} />
            </button>
         </Link>
      </div>

    </div>
  );
}