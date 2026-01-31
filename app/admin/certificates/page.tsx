"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2, RefreshCcw } from "lucide-react";

export default function AdminCertificatesPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // 1. Fetch Requests
  const fetchRequests = async () => {
    try {
      // Hum wahi purani API use kar sakte hain ya nayi bana sakte hain. 
      // Filhal hum aik nayi API banayenge "admin/all-requests" k liye.
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Handle Approval / Rejection
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setProcessing(id);
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (res.ok) {
        // Local list ko update karo taake refresh na karna pare
        setRequests(prev => prev.map(req => 
            req._id === id ? { ...req, status: newStatus } : req
        ));
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Error updating status");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin"/> Loading Requests...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Certificate Requests</h1>
           <p className="text-slate-500">Manage student applications for course certificates.</p>
        </div>
        <button onClick={fetchRequests} className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCcw size={20} className="text-slate-600"/>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
               <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Date Applied</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {requests.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No pending requests found.</td>
                 </tr>
               ) : (
                 requests.map((req) => (
                   <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                         <p className="font-bold text-slate-800">{req.studentName}</p>
                         <p className="text-xs text-slate-500">{req.email}</p>
                      </td>
                      <td className="p-4 font-medium text-slate-700">{req.courseTitle}</td>
                      <td className="p-4 text-sm text-slate-500">
                         {new Date(req.requestDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize
                            ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                              req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                         `}>
                            {req.status}
                         </span>
                      </td>
                      <td className="p-4 text-right">
                         {req.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                               <button 
                                 onClick={() => handleStatusUpdate(req._id, 'approved')}
                                 disabled={processing === req._id}
                                 className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition-all border border-green-200"
                               >
                                  {processing === req._id ? <Loader2 size={14} className="animate-spin"/> : <CheckCircle size={14} />} Approve
                               </button>
                               <button 
                                 onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                 disabled={processing === req._id}
                                 className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all border border-red-200"
                               >
                                  <XCircle size={14} /> Reject
                               </button>
                            </div>
                         )}
                         {req.status !== 'pending' && (
                            <span className="text-xs text-slate-400 font-medium italic">Action Taken</span>
                         )}
                      </td>
                   </tr>
                 ))
               )}
            </tbody>
         </table>
      </div>

    </div>
  );
}