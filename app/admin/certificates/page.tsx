"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, RefreshCcw, Lock } from "lucide-react";

export default function AdminCertificatesPage() {
   const [requests, setRequests] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [processing, setProcessing] = useState<string | null>(null);

   // 1. Fetch Requests
   const fetchRequests = async () => {
      setLoading(true);
      try {
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
      if (!confirm(`Are you sure you want to ${newStatus} this certificate?`)) return;

      setProcessing(id);
      try {
         const res = await fetch("/api/admin/certificates", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: newStatus }),
         });

         if (res.ok) {
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

   if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin" /> Loading Requests...</div>;

   return (
      <div className="p-6 space-y-6">

         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-2xl font-bold text-slate-800">Certificate Requests</h1>
               <p className="text-slate-500">Review and issue course certificates.</p>
            </div>
            <button onClick={fetchRequests} className="w-full md:w-auto p-2 bg-white flex items-center justify-center gap-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 font-bold md:font-normal">
               <RefreshCcw size={20} className="text-slate-600" /> <span className="md:hidden">Refresh List</span>
            </button>
         </div>

         <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto w-full">
               <table className="w-full min-w-[800px] text-left border-collapse text-sm">
                  <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                     <tr>
                        <th className="p-4">Student</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Fee Status</th>
                        <th className="p-4">Request Status</th>
                        <th className="p-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {requests.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="p-8 text-center text-slate-400">No pending requests found.</td>
                        </tr>
                     ) : (
                        requests.map((req) => {

                           // 👇 MAIN LOGIC: Fee Calculation
                           // 1. User k records main se is course ka record nikalo
                           const feeRecord = req.user?.feeRecords?.find((r: any) => r.courseSlug === req.courseId); // 'courseId' ya 'courseSlug' match karein

                           // 2. Values uthao (Agar record nahi mila tu Default values)
                           // "Admin ne kitni likhi hai" = feeRecord.totalFee
                           const totalFee = feeRecord?.totalFee || 5000;
                           const paid = feeRecord?.paidAmount || 0;

                           // 3. Balance Check
                           const remaining = totalFee - paid;
                           const isFullyPaid = remaining <= 0;

                           return (
                              <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="p-4">
                                    <div className="font-bold text-slate-800">{req.studentName}</div>
                                    <div className="text-xs text-slate-500">{req.email}</div>
                                 </td>
                                 <td className="p-4 font-medium text-slate-700">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                       {req.courseTitle || req.courseId}
                                    </span>
                                 </td>

                                 {/* 👇 FEE STATUS DISPLAY */}
                                 <td className="p-4">
                                    {isFullyPaid ? (
                                       <div className="flex flex-col">
                                          <span className="text-green-600 font-bold flex items-center gap-1 text-xs">
                                             <CheckCircle size={12} /> Fully Paid
                                          </span>
                                          <span className="text-[10px] text-slate-400">Total: {totalFee}</span>
                                       </div>
                                    ) : (
                                       <div className="flex flex-col items-start">
                                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold mb-1">
                                             Balance: Rs {remaining}
                                          </span>
                                          <span className="text-[10px] text-slate-500">
                                             Paid: <strong className="text-slate-700">{paid}</strong> / {totalFee}
                                          </span>
                                       </div>
                                    )}
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

                                          {/* 👇 APPROVE BUTTON (LOCKED IF FEE NOT PAID) */}
                                          {isFullyPaid ? (
                                             <button
                                                onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                disabled={processing === req._id}
                                                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm"
                                                title="Approve Certificate"
                                             >
                                                {processing === req._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Issue
                                             </button>
                                          ) : (
                                             <button disabled className="flex items-center gap-1 bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed border border-slate-200" title="Fee Pending - Cannot Issue">
                                                <Lock size={14} /> Locked
                                             </button>
                                          )}

                                          {/* REJECT BUTTON (Hamesha khula rahega) */}
                                          <button
                                             onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                             disabled={processing === req._id}
                                             className="flex items-center gap-1 bg-white text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-all"
                                          >
                                             <XCircle size={14} /> Reject
                                          </button>
                                       </div>
                                    )}
                                    {req.status !== 'pending' && (
                                       <span className="text-xs text-slate-400 font-medium italic">
                                          {req.status === 'approved' ? 'Certificate Issued' : 'Request Rejected'}
                                       </span>
                                    )}
                                 </td>
                              </tr>
                           );
                        })
                     )}
                  </tbody>
               </table>
            </div>
         </div>

      </div>
   );
}