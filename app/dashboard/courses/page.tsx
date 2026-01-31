"use client";

import { useEffect, useState } from "react";
import { courses } from "@/lib/courseData";
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
      if (!email) return;

      try {
        // 1. Fetch Enrolled Courses
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

        if (coursesData.enrolledCourses) {
          const enrolledDetails = courses.filter(course => 
            coursesData.enrolledCourses.includes(course.slug)
          );
          setMyCourses(enrolledDetails);
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
            // Refresh logic (Simple reload to update status)
            window.location.reload();
        } else {
            alert("Submission failed.");
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
      return req ? req.status : null; // returns 'pending', 'approved', or null
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
        <p className="text-slate-500">Live Classes & Certificate Status</p>
      </div>

      {myCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myCourses.map((course) => {
            const status = getStatus(course.slug); // Check status

            return (
                <div key={course.slug} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                
                {/* Image */}
                <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-2 py-1 rounded-lg">
                        {course.category}
                    </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{course.title}</h3>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-medium">
                        <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                        <span className="flex items-center gap-1"><PlayCircle size={14}/> Live Classes</span>
                    </div>

                    {/* STATUS BUTTONS - MAGIC IS HERE */}
                    <div className="mt-auto">
                        
                        {/* 1. Agar Approved hai -> DOWNLOAD Button */}
                        {status === 'approved' && (
                            <Link 
                                href={`/dashboard/certificate/${course.slug}`}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-green-200 shadow-lg"
                            >
                                <Award size={18} /> Download Certificate
                            </Link>
                        )}

                        {/* 2. Agar Pending hai -> PENDING Badge */}
                        {status === 'pending' && (
                            <button disabled className="w-full flex items-center justify-center gap-2 bg-yellow-100 text-yellow-700 py-2.5 rounded-xl font-bold cursor-not-allowed border border-yellow-200">
                                <Clock3 size={18} /> Approval Pending
                            </button>
                        )}

                        {/* 3. Agar Rejected hai -> Contact Admin */}
                        {status === 'rejected' && (
                            <button disabled className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2.5 rounded-xl font-bold cursor-not-allowed border border-red-200">
                                <CheckCircle size={18} /> Application Rejected
                            </button>
                        )}

                        {/* 4. Agar Kuch nahi (New) -> APPLY Button */}
                        {!status && (
                            <button 
                                onClick={() => handleApply(course.slug, course.title)}
                                disabled={applying === course.slug}
                                className="w-full flex items-center justify-center gap-2 bg-[#082F49] text-white py-2.5 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all disabled:opacity-70"
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
           <Link href="/" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Browse Courses</Link>
        </div>
      )}

    </div>
  );
}