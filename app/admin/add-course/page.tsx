"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    image: "",
    desc: "",
  });

  // Curriculum (Topics) State
  const [topic, setTopic] = useState("");
  const [curriculum, setCurriculum] = useState<string[]>([]);

  // Inputs Handle karo
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Topic Add karo
  const addTopic = () => {
    if (topic.trim()) {
      setCurriculum([...curriculum, topic]);
      setTopic("");
    }
  };

  // Topic Delete karo
  const removeTopic = (index: number) => {
    setCurriculum(curriculum.filter((_, i) => i !== index));
  };

  // FORM SUBMIT (API Call)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, curriculum }),
      });

      if (res.ok) {
        alert("Course Added Successfully! 🎉");
        router.push("/admin"); // Wapis dashboard bhej do
      } else {
        alert("Failed to add course.");
      }
    } catch (error) {
      alert("Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-white rounded-lg border hover:bg-slate-50">
           <ArrowLeft size={20} className="text-slate-600"/>
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Add New Course</h1>
           <p className="text-slate-500">Create a new course for students.</p>
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
              <input name="slug" required onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. graphic-design (No spaces)"/>
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

        {/* Row 3 */}
        <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <input name="category" required onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="e.g. Design, Tech"/>
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Image URL</label>
              <input name="image" required onChange={handleChange} className="w-full p-3 border rounded-xl" placeholder="https://..."/>
           </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
           <label className="text-sm font-bold text-slate-700">Description</label>
           <textarea name="desc" required onChange={handleChange} rows={4} className="w-full p-3 border rounded-xl" placeholder="Course details..."></textarea>
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
           {/* List */}
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