"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Loader2, Calendar, User, Tag, ArrowLeft } from "lucide-react";

export default function SingleBlogPage() {
    const { slug } = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`/api/blogs/${slug}`);
                if (!res.ok) { setNotFoundState(true); return; }
                const data = await res.json();
                setBlog(data.blog);
            } catch {
                setNotFoundState(true);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={36} />
        </div>
    );

    if (notFoundState || !blog) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Article Not Found</h1>
            <p className="text-slate-500 mb-6">This blog post doesn't exist or has been unpublished.</p>
            <Link href="/blogs" className="bg-[#082F49] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0C4A6E] transition-colors">
                Back to Blogs
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            {blog.coverImage && (
                <div className="w-full h-64 md:h-96 overflow-hidden relative">
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Back Link */}
                <Link href="/blogs" className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm mb-8 hover:underline">
                    <ArrowLeft size={16} /> Back to Blogs
                </Link>

                {/* Category */}
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 mb-4 inline-block">
                    {blog.category}
                </span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mt-3 mb-5">
                    {blog.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                    <span className="flex items-center gap-1.5">
                        <User size={14} /> <strong className="text-slate-700">{blog.author}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(blog.createdAt).toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                </div>

                {/* Content */}
                <div className="prose prose-slate max-w-none">
                    {blog.content.split("\n").map((paragraph: string, i: number) =>
                        paragraph.trim() ? (
                            <p key={i} className="mb-4 text-slate-700 leading-relaxed text-base">{paragraph}</p>
                        ) : (
                            <br key={i} />
                        )
                    )}
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                            <Tag size={14} className="text-slate-400" />
                            {blog.tags.map((tag: string) => (
                                <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-12 bg-gradient-to-br from-[#082F49] to-[#0C4A6E] rounded-2xl p-8 text-white text-center">
                    <h3 className="text-xl font-bold mb-2">Want to Learn More?</h3>
                    <p className="text-blue-200 mb-5">Explore our professional courses and boost your career today.</p>
                    <Link href="/courses" className="bg-white text-[#082F49] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-block">
                        View All Courses
                    </Link>
                </div>
            </div>
        </div>
    );
}
