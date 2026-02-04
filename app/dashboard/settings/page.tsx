"use client";

import { useState, useEffect } from "react";
import { Bell, Trash2, Shield, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      localStorage.clear();
      alert("Account Deleted Successfully.");
      router.push("/signup");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your account setting.</p>
      </div>

      {/* --- 2. DANGER ZONE --- */}
      <div className="bg-red-50 rounded-3xl border border-red-100 shadow-sm overflow-hidden transition-colors">
         <div className="p-6 border-b border-red-100">
            <h3 className="font-bold text-lg text-red-700 flex items-center gap-2">
               <Shield size={20} /> Danger Zone
            </h3>
         </div>
         <div className="p-6">
            <h4 className="font-bold text-slate-800 mb-2">Delete Account</h4>
            <p className="text-sm text-slate-500 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
            >
               <Trash2 size={18} /> Delete My Account
            </button>
         </div>
      </div>

      {/* --- DELETE MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                 <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Are you sure?</h3>
              <p className="text-center text-slate-500 text-sm mb-6">
                This action cannot be undone. All your course progress will be lost permanently.
              </p>
              
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowDeleteModal(false)}
                   className="flex-1 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleDeleteAccount}
                   disabled={deleting}
                   className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                 >
                   {deleting ? <Loader2 className="animate-spin" size={18}/> : "Yes, Delete"}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}