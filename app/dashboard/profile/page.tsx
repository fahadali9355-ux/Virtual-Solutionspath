"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, Lock, Save, Camera, Loader2, Eye, EyeOff, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // --- TOGGLES ---
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "", 
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 1. Fetch Profile Data from MongoDB
  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        
        if (data.user) {
          setFormData((prev) => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || "",
            image: data.user.image || "", 
          }));

          // 👇 Sync Sidebar Immediately on Load
          if(data.user.image) localStorage.setItem("profileImage", data.user.image);
          if(data.user.name) localStorage.setItem("userName", data.user.name);
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Handle Inputs
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Image Upload (Limit Size & Convert)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check size (Limit to 2MB to avoid DB overload)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size is too large! Please upload under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 4. Update Profile Logic
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");
    setError("");

    if (showPasswordSection && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match!");
            setUpdating(false);
            return;
        }
        if (!formData.currentPassword) {
            setError("Please enter your current password to make changes.");
            setUpdating(false);
            return;
        }
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            image: formData.image, // Sending Base64 string
            currentPassword: formData.currentPassword, 
            newPassword: formData.newPassword
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Profile updated successfully! ✅");
        
        // 👇 Sidebar Sync Logic
        localStorage.setItem("userName", formData.name);
        if(formData.image) localStorage.setItem("profileImage", formData.image);
        window.dispatchEvent(new Event("storage"));
        
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        setShowPasswordSection(false); 
      } else {
        setError(data.error || "Update failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-slate-500 flex items-center gap-2"><Loader2 className="animate-spin"/> Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500">Manage your account details and security.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* --- LEFT: Profile Card --- */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center sticky top-24">
             
             {/* Image Section */}
             <div className="relative w-32 h-32 mx-auto mb-4 group">
               <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                 {formData.image ? (
                    <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                    <span className="text-3xl font-bold text-blue-600">{formData.name?.charAt(0).toUpperCase()}</span>
                 )}
               </div>
               
               <label className="absolute bottom-1 right-1 bg-slate-800 text-white p-2.5 rounded-full hover:bg-blue-600 transition-colors shadow-md cursor-pointer">
                 <Camera size={16} />
                 <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
               </label>
             </div>
             
             <h2 className="font-bold text-xl text-slate-800">{formData.name}</h2>
             <p className="text-sm text-slate-500 mb-6">{formData.email}</p>

             <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3">
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <User size={16} className="text-blue-500"/> <span>Student</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-blue-500"/> <span className="truncate">{formData.email}</span>
               </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT: Edit Form --- */}
        <div className="md:col-span-2">
           <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-4 mb-4">Personal Details</h3>
              
              {/* Name Input */}
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Full Name</label>
                 <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
                    <User size={18} className="text-slate-400 mr-3"/>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      className="bg-transparent outline-none w-full text-slate-800 font-medium"
                    />
                 </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2 opacity-60">
                 <label className="text-sm font-bold text-slate-700">Email Address (Locked)</label>
                 <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-4 py-3">
                    <Mail size={18} className="text-slate-400 mr-3"/>
                    <input type="email" value={formData.email} readOnly className="bg-transparent outline-none w-full text-slate-600 font-medium cursor-not-allowed"/>
                 </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700">Phone Number</label>
                 <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
                    <Phone size={18} className="text-slate-400 mr-3"/>
                    <input 
                      type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+92 300 1234567"
                      className="bg-transparent outline-none w-full text-slate-800 font-medium"
                    />
                 </div>
              </div>

              {/* --- SECURITY SECTION --- */}
              <div className="pt-6 border-t border-slate-100">
                 <button 
                    type="button"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-4 rounded-xl transition-all group"
                 >
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800">Security & Password</h3>
                            <p className="text-xs text-slate-500">Update your password securely</p>
                        </div>
                    </div>
                    {showPasswordSection ? <ChevronUp className="text-slate-400"/> : <ChevronDown className="text-slate-400"/>}
                 </button>
                 
                 {/* --- HIDDEN PASSWORD FIELDS --- */}
                 {showPasswordSection && (
                    <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        {/* 1. Old Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Current Password</label>
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
                                <Lock size={18} className="text-slate-400 mr-3"/>
                                <input 
                                type={showCurrentPass ? "text" : "password"} 
                                name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Enter old password"
                                className="bg-transparent outline-none w-full text-slate-800 font-medium"
                                />
                                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="text-slate-400 hover:text-blue-600">
                                    {showCurrentPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* 2. New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">New Password</label>
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
                                <Lock size={18} className="text-slate-400 mr-3"/>
                                <input 
                                type={showNewPass ? "text" : "password"} 
                                name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Enter new password"
                                className="bg-transparent outline-none w-full text-slate-800 font-medium"
                                />
                                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="text-slate-400 hover:text-blue-600">
                                    {showNewPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>

                        {/* 3. Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Confirm New Password</label>
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 ring-blue-100 transition-all">
                                <Lock size={18} className="text-slate-400 mr-3"/>
                                <input 
                                type={showConfirmPass ? "text" : "password"} 
                                name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Retype new password"
                                className="bg-transparent outline-none w-full text-slate-800 font-medium"
                                />
                                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-slate-400 hover:text-blue-600">
                                    {showConfirmPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                        </div>
                    </div>
                 )}
              </div>

              {/* MESSAGES */}
              {message && <div className="p-3 rounded-xl bg-green-100 text-green-700 text-sm font-bold text-center">{message}</div>}
              {error && <div className="p-3 rounded-xl bg-red-100 text-red-700 text-sm font-bold text-center">{error}</div>}

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                 <button 
                    type="submit" 
                    disabled={updating}
                    className="bg-[#082F49] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0C4A6E] transition-all flex items-center gap-2 shadow-lg disabled:opacity-70"
                 >
                    {updating ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                    Save Changes
                 </button>
              </div>

           </form>
        </div>

      </div>
    </div>
  );
}