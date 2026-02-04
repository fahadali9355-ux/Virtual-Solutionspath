"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  
  const [step, setStep] = useState(1); // 1=Email, 2=Code, 3=NewPass
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --- STEP 1: SEND EMAIL ---
  const handleSendCode = async (e: any) => {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2); // Move to Code Step
        setMessage("Code sent to your email!");
      } else {
        setError(data.error || "Failed to send code");
      }
    } catch (err) { setError("Something went wrong"); }
    setLoading(false);
  };

  // --- STEP 2: VERIFY CODE ---
  const handleVerifyCode = async (e: any) => {
    e.preventDefault();
    setLoading(true); setError("");
    
    try {
      // API call main email aur code dono bhej rahay hain
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setStep(3); // Move to New Password Step
        setMessage("Code Verified! Set new password.");
      } else {
        setError(data.error || "Invalid Code");
      }
    } catch (err) { setError("Verification failed"); }
    setLoading(false);
  };

  // --- STEP 3: RESET PASSWORD ---
  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setLoading(true); setError("");

    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: passwords.new }),
      });
      
      const data = await res.json();

      if (res.ok) {
        alert("Password Changed Successfully! Login Now.");
        router.push("/login");
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) { setError("Error resetting password"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center mb-8">
           <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
           <p className="text-slate-500 text-sm mt-2">
             {step === 1 && "Enter your email to receive a code."}
             {step === 2 && "Enter the 6-digit code sent to your email."}
             {step === 3 && "Create a secure new password."}
           </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded-lg text-center">{message}</div>}

        {/* --- STEP 1 FORM --- */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center">
               <Mail className="text-slate-400 mr-3" size={20} />
               <input type="email" required placeholder="student@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} className="bg-transparent outline-none w-full"/>
            </div>
            <button disabled={loading} className="w-full bg-[#082F49] text-white py-3 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all flex justify-center">
               {loading ? <Loader2 className="animate-spin"/> : "Send Code"}
            </button>
          </form>
        )}

        {/* --- STEP 2 FORM --- */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
             <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center">
               <input type="text" required placeholder="123456" value={code} onChange={(e)=>setCode(e.target.value)} className="bg-transparent outline-none w-full text-center text-2xl font-bold tracking-widest text-slate-800"/>
            </div>
            <button disabled={loading} className="w-full bg-[#082F49] text-white py-3 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all flex justify-center">
               {loading ? <Loader2 className="animate-spin"/> : "Verify Code"}
            </button>
          </form>
        )}

        {/* --- STEP 3 FORM --- */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
             <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center">
               <Lock className="text-slate-400 mr-3" size={20} />
               <input type="password" required placeholder="New Password" value={passwords.new} onChange={(e)=>setPasswords({...passwords, new: e.target.value})} className="bg-transparent outline-none w-full"/>
            </div>
             <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center">
               <CheckCircle className="text-slate-400 mr-3" size={20} />
               <input type="password" required placeholder="Confirm Password" value={passwords.confirm} onChange={(e)=>setPasswords({...passwords, confirm: e.target.value})} className="bg-transparent outline-none w-full"/>
            </div>
            <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex justify-center">
               {loading ? <Loader2 className="animate-spin"/> : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-slate-500 hover:text-blue-600">Back to Login</Link>
        </div>

      </div>
    </div>
  );
}