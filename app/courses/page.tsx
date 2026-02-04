import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Link from "next/link";
import { Star, ArrowLeft, Filter } from "lucide-react";

export const dynamic = "force-dynamic"; // Search params k liye zaroori hai

export default async function AllCoursesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  
  // 1. URL se category pakrein (e.g. ?category=Web Development)
  const { category } = await searchParams;
  
  // 2. Filter logic
  const filter = category ? { category: category } : {};

  await connectDB();
  const courses = await Course.find(filter).lean();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-4 transition-colors">
             <ArrowLeft size={16}/> Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
            <div>
                <span className="text-blue-600 font-bold tracking-wide text-sm uppercase">
                    {category ? "Filtered Result" : "Discover"}
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#082F49] mt-1">
                {category ? `${category} Courses` : "All Available Courses"}
                </h1>
            </div>
            
            {category && (
                <Link href="/courses">
                    <button className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition-all">
                        <Filter size={16} /> Clear Filter
                    </button>
                </Link>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? (
            courses.map((course: any) => (
              <Link key={course._id} href={`/courses/${course.slug}`}>
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  
                  {/* Image Area */}
                  <div className="h-52 bg-slate-200 relative overflow-hidden">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm text-[#082F49]">
                      {course.category}
                    </span>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-[#082F49] mb-3 group-hover:text-blue-600 line-clamp-1 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">
                      {course.desc || course.description}
                    </p>
                    
                    <div className="flex justify-between items-center mt-auto pt-5 border-t border-slate-50">
                       <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-md text-yellow-600 font-bold text-xs">
                         <Star size={14} fill="currentColor" /> 4.8
                       </div>
                       <span className="text-blue-600 text-sm font-bold group-hover:underline underline-offset-4 decoration-2">
                           View Details
                       </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Filter size={30} />
              </div>
              <p className="text-slate-500 text-lg font-medium">No courses found in this category.</p>
              <Link href="/courses">
                <button className="mt-4 text-white bg-blue-600 px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all">
                    View All Courses
                </button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}