"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  // 👇 STATE: Form data store karne k liye
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // 👇 Handle Input Change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👇 Handle Submit (Email Bhejna)
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Page refresh hone se roko
    setStatus("loading");

    try {
        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setStatus("success");
            setFormData({ firstName: "", lastName: "", email: "", message: "" }); // Form clear karo
        } else {
            setStatus("error");
        }
    } catch (error) {
        setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-20 px-6 flex items-center justify-center">
      
      <div className="max-w-6xl w-full">
        
        {/* Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
           <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
              <ArrowLeft size={18} className="mr-2"/> Back to Home
           </Link>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-0 shadow-2xl rounded-3xl overflow-hidden bg-white border border-slate-100">
            
            {/* Left Side: Info */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-[#082F49] p-10 md:p-12 text-white relative overflow-hidden flex flex-col justify-between"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Let's Chat!</h1>
                    <p className="text-blue-200 mb-10 text-lg leading-relaxed">
                       Have a question about a course or need support? We respond within 24 hours.
                    </p>
                    
                    <div className="space-y-8">
                        <ContactItem icon={Mail} title="Email" desc="virtualsolutions.path@gmail.com" />
                        <ContactItem icon={Phone} title="Phone" desc="+92 321 0030888 +92 318 2009250" />
                        <ContactItem icon={MapPin} title="Office" desc="Admission Office, Bank Lane near State bank, Faisalabad" />
                    </div>
                </div>

                <div className="relative z-10 mt-12">
                   <p className="text-sm text-blue-300">© 2026 Virtual Solution Path Inc.</p>
                </div>
            </motion.div>

            {/* Right Side: Form */}
            <div className="lg:col-span-3 p-10 md:p-16 bg-white">
                <motion.form 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3, duration: 0.6 }}
                   className="space-y-6"
                   onSubmit={handleSubmit} // 👈 Connect Submit Logic
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        <InputGroup 
                            label="First Name" name="firstName" placeholder="Ali" 
                            value={formData.firstName} onChange={handleChange} required 
                        />
                        <InputGroup 
                            label="Last Name" name="lastName" placeholder="Raza" 
                            value={formData.lastName} onChange={handleChange} required
                        />
                    </div>
                    
                    <InputGroup 
                        label="Email Address" name="email" placeholder="ali@example.com" type="email" 
                        value={formData.email} onChange={handleChange} required
                    />
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                        <textarea 
                          rows={4} 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" 
                          placeholder="How can we help you?"
                        ></textarea>
                    </div>

                    {/* 👇 Dynamic Button (Loading/Success/Default) */}
                    <button 
                        disabled={status === "loading" || status === "success"}
                        className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group
                            ${status === "success" ? "bg-green-600 text-white" : "bg-[#0284C7] hover:bg-[#0369A1] text-white"}
                        `}
                    >
                        {status === "loading" ? (
                            <> <Loader2 className="animate-spin" /> Sending... </>
                        ) : status === "success" ? (
                            <> <CheckCircle /> Message Sent! </>
                        ) : (
                            <> Send Message <Send size={18} className="group-hover:translate-x-1 transition-transform" /> </>
                        )}
                    </button>

                    {/* Error Message */}
                    {status === "error" && (
                        <p className="text-red-500 text-center text-sm font-bold">Something went wrong. Please try again.</p>
                    )}

                </motion.form>
            </div>

        </div>
      </div>
    </div>
  );
}

// Helper Components
function ContactItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-blue-300"/>
            </div>
            <div>
                <h4 className="font-bold text-lg">{title}</h4>
                <p className="text-blue-100/80 text-sm">{desc}</p>
            </div>
        </div>
    );
}

function InputGroup({ label, name, placeholder, type = "text", value, onChange, required }: any) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
            <input 
              type={type} 
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" 
              placeholder={placeholder} 
            />
        </div>
    );
}