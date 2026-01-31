"use client";

import { useRef, useState, useEffect } from "react";
import { courses } from "@/lib/courseData";
import { notFound, useParams } from "next/navigation";
import { Download, Share2, Award, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificatePage() {
  const params = useParams();
  const slug = params.slug;
  const certificateRef = useRef<HTMLDivElement>(null); // 👈 Is element ki photo lenge

  const course = courses.find((c) => c.slug === slug);
  const [studentName, setStudentName] = useState("Student Name");
  const [downloading, setDownloading] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    // LocalStorage se naam uthao
    const name = localStorage.getItem("userName");
    if (name) setStudentName(name);
    
    // Aaj ki date set karo
    setDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }));
  }, []);

  // --- PDF DOWNLOAD FUNCTION ---
  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 }); // High Quality
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("l", "mm", "a4"); // Landscape, A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${studentName}-${course?.title}-Certificate.pdf`);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setDownloading(false);
    }
  };

  if (!course) return notFound();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-10">
      
      {/* --- BUTTONS --- */}
      <div className="mb-8 flex gap-4">
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
        >
          {downloading ? <Loader2 className="animate-spin" /> : <Download size={20}/>}
          Download PDF
        </button>
      </div>

      {/* --- CERTIFICATE DESIGN (A4 RATIO) --- */}
      <div 
        ref={certificateRef}
        className="w-full max-w-[1000px] aspect-[1.414/1] bg-white text-slate-800 shadow-2xl relative overflow-hidden border-[10px] border-double border-[#082F49] p-10 flex flex-col items-center justify-center text-center"
      >
        
        {/* Background Watermark/Decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-br-full opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 rounded-tl-full opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
           <Award size={400} />
        </div>

        {/* --- CONTENT --- */}
        
        {/* Header */}
        <div className="mb-8">
           <div className="flex items-center justify-center gap-2 mb-2">
             <div className=" flex items-center justify-center font-bold"><img 
                src="/images/img1.png" 
                alt="VSP Logo" 
                className="w-10 h-10 object-contain rounded-full" /></div>
             <span className="text-xl font-bold text-[#082F49]">VSP.</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#082F49] tracking-wider uppercase mb-2">
             Certificate of Completion
           </h1>
           <p className="text-slate-500 italic">This certificate is proudly presented to</p>
        </div>

        {/* Student Name */}
        <div className="border-b-2 border-slate-300 pb-2 mb-6 px-10 min-w-[50%]">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0C4A6E] capitalize">
            {studentName}
          </h2>
        </div>

        {/* Text */}
        <p className="max-w-2xl text-lg text-slate-600 mb-8 leading-relaxed">
          For successfully completing the <strong>{course.title}</strong> course with dedication and excellence. 
          We acknowledge your hard work and skills acquired during this training at <strong>Virtual Solution Path</strong>.
        </p>

        {/* Footer (Signatures) */}
        <div className="w-full flex justify-between items-end px-10 mt-auto">
           <div className="text-center">
              <p className="font-bold text-lg text-[#082F49] mb-1">{date}</p>
              <div className="h-px w-40 bg-slate-400 mx-auto"></div>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Date Issued</p>
           </div>

           <div className="w-24 h-24 relative opacity-80">
              {/* Badge/Seal */}
              <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-dashed animate-spin-slow"></div>
              <div className="absolute inset-2 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs text-center shadow-inner">
                 VSP<br/>CERTIFIED
              </div>
           </div>

           <div className="text-center">
              <p className="font-serif text-2xl text-blue-800 italic mb-1">CEO VSP</p>
              <div className="h-px w-40 bg-slate-400 mx-auto"></div>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">Signature</p>
           </div>
        </div>

      </div>

    </div>
  );
}