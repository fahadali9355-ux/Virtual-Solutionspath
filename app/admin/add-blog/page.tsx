"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AddBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [published, setPublished] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        author: "VSP Admin",
        category: "",
        coverImage: "",
        excerpt: "",
        content: "",
        tags: "",
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/admin/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, published }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Blog Published! 🎉");
                router.push("/admin/blogs");
            } else {
                alert(data.error || "Failed to save blog.");
            }
        } catch {
            alert("Server error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/blogs" className="p-2 bg-white rounded-lg border hover:bg-slate-50">
                    <ArrowLeft size={20} className="text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Write New Blog</h1>
                    <p className="text-slate-500">Create a new article or blog post.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">

                {/* Title */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Blog Title *</label>
                    <input name="title" required onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="e.g. Top 5 Graphic Design Tips for Beginners" />
                </div>

                {/* Row: Author + Category */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Author</label>
                        <input name="author" value={formData.author} onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="VSP Admin" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Category *</label>
                        <input name="category" required onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="e.g. Design, Technology, Career" />
                    </div>
                </div>

                {/* Cover Image URL */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Cover Image URL</label>
                    <input name="coverImage" onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="https://..." />
                    <p className="text-xs text-slate-500">Paste an image URL (from Google Drive, Imgur, etc.)</p>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Short Description (Excerpt) *</label>
                    <textarea name="excerpt" required onChange={handleChange} rows={2} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="A short 1-2 line description that appears on the blog listing page..." />
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Main Content *</label>
                    <textarea name="content" required onChange={handleChange} rows={12} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none font-mono text-sm" placeholder="Write your full blog article here. You can use line breaks and paragraphs..." />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Tags (comma separated)</label>
                    <input name="tags" onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none" placeholder="e.g. Design, Tips, Freelancing" />
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                        <p className="font-bold text-slate-700">Publish Status</p>
                        <p className="text-xs text-slate-500">{published ? "This blog will be visible to everyone." : "Draft – only visible to you in the admin."}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setPublished(!published)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${published ? "bg-green-600 text-white hover:bg-green-700" : "bg-slate-200 text-slate-600 hover:bg-slate-300"}`}
                    >
                        {published ? <><Eye size={16} /> Published</> : <><EyeOff size={16} /> Draft</>}
                    </button>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#082F49] text-white py-4 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Blog</>}
                </button>
            </form>
        </div>
    );
}
