"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash, Loader2, ArrowLeft, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form Data State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    price: "",
    duration: "",
    lessons: "",
    desc: "",
    learningPoints: "", // 👈 1. Nayi field add ki
  });

  // Image & Curriculum State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [curriculum, setCurriculum] = useState<string[]>([]);

  // Inputs Handle
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Select Handle
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove Image
  const removeImage = () => {
      setImageFile(null);
      setPreview(null);
  };

  // Topic Add
  const addTopic = () => {
    if (topic.trim()) {
      setCurriculum([...curriculum, topic]);
      setTopic("");
    }
  };

  // Topic Delete
  const removeTopic = (index: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  // FORM SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!imageFile) {
        alert("Please upload a course image!");
        return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("duration", formData.duration);
      data.append("lessons", formData.lessons);
      data.append("desc", formData.desc);
      data.append("learningPoints", formData.learningPoints); // 👈 2. Data backend ko bheja
      data.append("image", imageFile); 
      
      data.append("curriculum", JSON.stringify(curriculum));

      const res = await fetch("/api/admin/add-course", { // Note: API route ka naam check kar lein agar add-course hai ya add-courses
        method: "POST",
        body: data, 
      });

      const responseData = await res.json();

      if (res.ok) {
        alert("Course Added Successfully! 🎉");
        router.push("/admin/manage-courses"); 
      } else {
        alert(responseData.error || "Failed to add course.");
      }
    } catch (error) {
      alert("Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 p-6">
      
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-white rounded-lg border hover:bg-slate-50">
            <ArrowLeft size={20} className="text-slate-600"/>
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Add New Course</h1>
            <p className="text-slate-500">Create a new course with thumbnail.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        
        {/* Row 1 */}
        <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Course Title</label>
              <input name="title" required onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. Graphic Design Masterclass"/>
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Slug (URL)</label>
              <input name="slug" onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="Leave empty to auto-generate"/>
           </div>
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Price</label>
              <input name="price" required onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="Rs. 5,000"/>
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Duration</label>
              <input name="duration" required onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="2 Months"/>
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Total Lessons</label>
              <input name="lessons" required onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="24 Lessons"/>
           </div>
        </div>

        {/* Row 3: Category & Image Upload */}
        <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <input name="category" required onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. Design, Tech"/>
           </div>
           
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Course Thumbnail</label>
              
              {!preview ? (
                  <label className="flex flex-col items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-2 text-slate-400">
                           <UploadCloud size={20} />
                           <span className="text-sm">Upload Image</span>
                       </div>
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
              ) : (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 group">
                       <Image src={preview} alt="Preview" fill className="object-cover" />
                       <button type="button" onClick={removeImage} 
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity">
                          <X size={16} />
                       </button>
                  </div>
              )}
           </div>
        </div>

        {/* 👇 3. NAYA SECTION: What You Will Learn */}
        <div className="space-y-2">
           <label className="text-sm font-bold text-slate-700">What You Will Learn (Comma Separated)</label>
           <textarea 
              name="learningPoints" 
              onChange={handleChange} 
              rows={2} 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
              placeholder="e.g. React Basics, Frontend Design, Backend API"
           ></textarea>
           <p className="text-xs text-slate-500">Separate each point with a comma (,)</p>
        </div>

        {/* Description */}
        <div className="space-y-2">
           <label className="text-sm font-bold text-slate-700">Description</label>
           <textarea name="desc" required onChange={handleChange} rows={4} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="Course details..."></textarea>
        </div>

        {/* Curriculum Builder */}
        <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
           <label className="text-sm font-bold text-slate-700">Curriculum (Topics)</label>
           <div className="flex gap-2">
              <input 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                className="flex-1 p-3 border rounded-xl" 
                placeholder="Add a topic (e.g. Intro to Photoshop)"
              />
              <button type="button" onClick={addTopic} className="bg-slate-800 text-white px-4 rounded-xl font-bold hover:bg-slate-900">
                 <Plus size={20} />
              </button>
           </div>
           <div className="mt-4 space-y-2">
              {curriculum.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                   <span className="text-sm font-medium">{index + 1}. {item}</span>
                   <button type="button" onClick={() => removeTopic(index)} className="text-red-500 hover:text-red-700"><Trash size={16}/></button>
                </div>
              ))}
           </div>
        </div>

        <button disabled={loading} className="w-full bg-[#082F49] text-white py-4 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all flex justify-center items-center gap-2 shadow-lg">
           {loading ? <Loader2 className="animate-spin"/> : <><Save size={20} /> Save Course</>}
        </button>

      </form>
    </div>
  );
}