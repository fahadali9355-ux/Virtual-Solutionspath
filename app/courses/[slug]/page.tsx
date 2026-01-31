"use client";

import { useState } from "react";
import { courses } from "@/lib/courseData";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation"; 
import { Clock, CheckCircle, ArrowLeft, PlayCircle, Star, Loader2 } from "lucide-react";

export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  
  // URL se Slug uthaya
  const slug = params.slug; 
  
  // Course dhoonda
  const course = courses.find((c) => c.slug === slug);
  
  const [loading, setLoading] = useState(false);

  // --- ENROLLMENT FUNCTION ---
  const handleEnroll = async () => {
    // 1. Check karo user login hai ya nahi (LocalStorage se)
    const userEmail = localStorage.getItem("userEmail"); 
    
    if (!userEmail) {
      alert("Please Login First! 🔒");
      router.push("/login"); // Agar login nahi to Login page par bhejo
      return;
    }

    setLoading(true);

    try {
      // 2. API ko call karo
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 👇 UPDATE: Ab hum 'slug' bhej rahe hain kyunke aapke data main 'id' nahi hai
        body: JSON.stringify({ 
            email: userEmail, 
            courseId: course?.slug 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Enrollment Successful! Check your Dashboard.");
        router.push("/dashboard/courses"); // Kamyabi k baad My Courses main bhej do
      } else {
        alert(data.message || "Enrollment Failed"); 
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Agar Course nahi mila to 404 page dikhao
  if (!course) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* HERO SECTION */}
      <div className="relative h-[500px] w-full bg-[#082F49]">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082F49] via-[#082F49]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto flex flex-col items-start">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors font-medium">
            <ArrowLeft size={20} className="mr-2" /> Back to All Courses
          </Link>
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            {course.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium text-blue-100">
             <span className="flex items-center gap-2"><Clock size={18} /> {course.duration}</span>
             <span className="flex items-center gap-2"><PlayCircle size={18} /> {course.lessons}</span>
             <span className="flex items-center gap-2 text-yellow-400"><Star size={18} fill="currentColor" /> 4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 grid md:grid-cols-3 gap-10">
        
        {/* Details */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-[#082F49] mb-4">About This Course</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {course.desc}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-[#082F49] mb-6">What You Will Learn</h2>
            <div className="grid gap-4">
              {course.curriculum.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={22} />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ENROLL CARD */}
        <div className="md:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enroll Today</h3>
            <p className="text-slate-500 text-sm mb-6">Get instant access to course materials.</p>
            
            <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
               <span className="text-gray-500 font-medium">Course Fee</span>
               <span className="text-4xl font-extrabold text-[#082F49]">{course.price}</span>
            </div>

            {/* ENROLL BUTTON */}
            <button 
              onClick={handleEnroll}
              disabled={loading}
              className="w-full bg-[#0C4A6E] hover:bg-[#082F49] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-900/30 transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:bg-slate-400"
            >
              {loading ? (
                <> <Loader2 className="animate-spin" /> Processing... </>
              ) : (
                "Join Now"
              )}
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4">Secure Payment • 30-Day Money-Back Guarantee</p>
          </div>
        </div>

      </div>
    </div>
  );
}