import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, PlayCircle, Star, CheckCircle } from "lucide-react";
import CourseEnrollment from "@/components/CourseEnrollment"; 

export default async function CourseDetail({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;

  await connectDB();
  
  // 1. Data fetch karein (.lean() use karein)
  const courseRaw = await Course.findOne({ slug }).lean();

  if (!courseRaw) return notFound();

  // 👇 2. FIX: Ye line ERROR khatam karegi
  // (MongoDB object ko simple JSON main convert kar rahe hain taa k _id ka masla na aye)
  const course = JSON.parse(JSON.stringify(courseRaw));

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
              <span className="flex items-center gap-2"><PlayCircle size={18} /> {course.lessons || "Multiple"} Lessons</span>
              <span className="flex items-center gap-2 text-yellow-400"><Star size={18} fill="currentColor" /> 4.9 Rating</span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 grid md:grid-cols-3 gap-10">
        
        {/* Details (Left Side) */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-[#082F49] mb-4">About This Course</h2>
            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
              {course.description || course.desc}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-[#082F49] mb-6">What You Will Learn</h2>
            <div className="grid gap-4">
              {course.curriculum && course.curriculum.length > 0 ? (
                  course.curriculum.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={22} />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))
              ) : (
                  <p className="text-slate-500 italic">Curriculum details updated soon.</p>
              )}
            </div>
          </div>
        </div>

        {/* ENROLL CARD (Right Side) */}
        <div className="md:col-span-1">
            {/* 👇 Ab ye perfectly chalega kyunke humne 'course' ko clean kar dia hai */}
            <CourseEnrollment course={course} slug={slug} />
        </div>

      </div>
    </div>
  );
}