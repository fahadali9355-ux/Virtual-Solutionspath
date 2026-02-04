"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CourseEnrollment({ course, slug }: { course: any, slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkLoading, setCheckLoading] = useState(true);

  // 👇 FIX: Price Logic (NaN issue solved)
  const rawPrice = course?.price ? course.price.toString().replace(/[^0-9]/g, "") : "";
  const actualPrice = rawPrice ? parseInt(rawPrice) : 0;

  // 1. Check Enrollment Status
  useEffect(() => {
    const checkEnrollment = async () => {
        const email = localStorage.getItem("userEmail");
        if (!email) {
            setCheckLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/my-courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            
            if (data.courses && data.courses.some((c: any) => c.slug === slug)) {
                setIsEnrolled(true);
            }
        } catch (error) {
            console.error("Error checking enrollment");
        } finally {
            setCheckLoading(false);
        }
    };

    checkEnrollment();
  }, [slug]);

  // 2. Handle Enroll Click
  const handleEnroll = () => {
    const userEmail = localStorage.getItem("userEmail"); 
    
    if (!userEmail) {
      alert("Please Login First to Enroll! 🔒");
      router.push("/login");
      return;
    }

    setLoading(true);
    // Redirect to payment
    router.push(`/courses/${slug}/payment`);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 sticky top-24">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Enroll Today</h3>
        <p className="text-slate-500 text-sm mb-6">Get instant access to course materials.</p>
        
        <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
            <span className="text-gray-500 font-medium">Course Fee</span>
            
            {/* 👇 FIX: Display Logic Updated */}
            <span className="text-4xl font-extrabold text-[#082F49]">
                {actualPrice > 0 ? `Rs ${actualPrice.toLocaleString()}` : "Free"}
            </span>
        </div>

        {/* DYNAMIC BUTTONS */}
        {checkLoading ? (
                <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-xl flex justify-center items-center">
                    <Loader2 className="animate-spin mr-2" /> Checking...
                </button>
        ) : isEnrolled ? (
            <Link href="/dashboard/courses">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> Go to Dashboard
                </button>
            </Link>
        ) : (
            <button 
                onClick={handleEnroll}
                disabled={loading}
                className="w-full bg-[#0C4A6E] hover:bg-[#082F49] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-900/30 transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:bg-slate-400"
            >
                {loading ? (
                <> <Loader2 className="animate-spin" /> Processing... </>
                ) : (
                <> <CreditCard size={20} /> Join Now </>
                )}
            </button>
        )}
        
        <p className="text-center text-xs text-slate-400 mt-4">Secure Payment • Lifetime Access</p>
    </div>
  );
}