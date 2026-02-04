"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, PlayCircle, ArrowRight, Loader2, Award, Clock3, CheckCircle } from "lucide-react";

export default function MyCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]); // Status track karne k liye
  const [applying, setApplying] = useState<string | null>(null); // Loading state for button

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch Enrolled Courses (Database se Pura Data)
        const coursesRes = await fetch("/api/my-courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const coursesData = await coursesRes.json();

        // 2. Fetch Certificate Requests Status
        const statusRes = await fetch("/api/certificate/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const statusData = await statusRes.json();

        // 👇 UPDATED: Ab hum filter nahi kar rahe, direct DB ka data set kar rahe hain
        if (coursesData.courses) {
          setMyCourses(coursesData.courses);
        }

        if (statusData.requests) {
            setRequests(statusData.requests);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- APPLY FUNCTION ---
  const handleApply = async (courseSlug: string, courseTitle: string) => {
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    
    setApplying(courseSlug);

    try {
        const res = await fetch("/api/certificate/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentName: name,
                email: email,
                courseId: courseSlug,
                courseTitle: courseTitle
            })
        });

        if (res.ok) {
            alert("Application Submitted! Admin will review it shortly.");
            window.location.reload(); // Reload to show Pending status
        } else {
            const err = await res.json();
            alert(err.message || "Submission failed.");
        }
    } catch (error) {
        alert("Error applying.");
    } finally {
        setApplying(null);
    }
  };

  // Helper to check status
  const getStatus = (slug: string) => {
      const req = requests.find((r: any) => r.courseId === slug);
      return req ? req.status : null; // 'pending', 'approved', or 'rejected'
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-500 gap-2">
        <Loader2 className="animate-spin" /> Loading your courses...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Learning</h1>
        <p className="text-slate-500">Access your courses and track certificate progress.</p>
      </div>

      {myCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myCourses.map((course) => {
            const status = getStatus(course.slug); // Check certificate status

            return (
                <div key={course._id || course.slug} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group">
                
                {/* Image */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#082F49] text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                        {course.category}
                    </span>
                    
                    {/* Hover Resume Button */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Link href={`/courses/${course.slug}`}>
                         <button className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <PlayCircle size={18} /> Resume
                         </button>
                       </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1" title={course.title}>{course.title}</h3>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-medium">
                        <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                        <span className="flex items-center gap-1"><BookOpen size={14}/> {course.lessons} Lessons</span>
                    </div>

                    <div className="mt-auto space-y-3">
                        
                        {/* 2. CERTIFICATE STATUS BUTTONS */}
                        
                        {/* APPROVED -> DOWNLOAD */}
                        {status === 'approved' && (
                            <Link 
                                href={`/dashboard/certificate/${course.slug}`}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-green-100 shadow-lg text-sm"
                            >
                                <Award size={18} /> Download Certificate
                            </Link>
                        )}

                        {/* PENDING */}
                        {status === 'pending' && (
                            <button disabled className="w-full flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 py-2.5 rounded-xl font-bold cursor-not-allowed border border-yellow-200 text-sm">
                                <Clock3 size={18} /> Approval Pending
                            </button>
                        )}

                        {/* REJECTED */}
                        {status === 'rejected' && (
                            <button disabled className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 py-2.5 rounded-xl font-bold cursor-not-allowed border border-red-200 text-sm">
                                <CheckCircle size={18} /> Application Rejected
                            </button>
                        )}

                        {/* NEW -> APPLY */}
                        {!status && (
                            <button 
                                onClick={() => handleApply(course.slug, course.title)}
                                disabled={applying === course.slug}
                                className="w-full flex items-center justify-center gap-2 bg-[#082F49] text-white py-2.5 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all disabled:opacity-70 text-sm"
                            >
                                {applying === course.slug ? <Loader2 className="animate-spin" size={18}/> : <Award size={18} />}
                                Apply for Certificate
                            </button>
                        )}

                    </div>
                </div>
                </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
           <BookOpen size={32} className="mx-auto text-slate-400 mb-2"/>
           <h3 className="text-xl font-bold text-slate-800">No Courses Yet</h3>
           <p className="text-slate-500 mb-6">You haven't enrolled in any courses yet.</p>
           <Link href="/" className="bg-[#082F49] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all inline-block">
             Browse Courses
           </Link>
        </div>
      )}

    </div>
  );
}