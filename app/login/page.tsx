"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // 1. Save User Data & ROLE
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userName", data.user.name);
        
        // 👇 Yeh Line Zaroori hai (Admin Guard k liye)
        localStorage.setItem("userRole", data.user.role || "student"); 

        // 2. Role Based Redirect (Kahan bhejna hai?)
        if (data.user.role === "admin") {
            // Agar Admin hai to Admin Panel
            router.push("/admin"); 
        } else {
            // Agar Student hai to Student Dashboard
            router.push("/dashboard/courses"); 
        }

      } else {
        setError(data.error || "Invalid Credentials");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full relative">
        
        <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-blue-600">
           <ArrowLeft size={24} />
        </Link>

        <div className="text-center mb-8 mt-4">
           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">V</div>
           <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
           <p className="text-slate-500 text-sm">Login to continue learning</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
           
           {/* Email */}
           <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
                <Mail size={18} className="text-slate-400 mr-3"/>
                <input 
                  type="email" name="email" required placeholder="student@example.com"
                  value={formData.email} onChange={handleChange}
                  className="bg-transparent outline-none w-full text-slate-800 font-medium"
                />
              </div>
           </div>

           {/* Password */}
           <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-sm font-bold text-slate-700">Password</label>
                 <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">
                    Forgot Password?
                 </Link>
              </div>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
                <Lock size={18} className="text-slate-400 mr-3"/>
                <input 
                  type="password" name="password" required placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                  className="bg-transparent outline-none w-full text-slate-800 font-medium"
                />
              </div>
           </div>

           <button disabled={loading} className="w-full bg-[#082F49] text-white py-3.5 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-blue-900/20">
              {loading ? <Loader2 className="animate-spin"/> : <><LogIn size={20} /> Log In</>}
           </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
           Don't have an account? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Sign up</Link>
        </p>

      </div>
    </div>
  );
}