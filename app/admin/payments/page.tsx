"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, Search, Edit, Save } from "lucide-react";

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // --- EDITING STATES ---
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempPaid, setTempPaid] = useState<number>(0);
    const [tempTotal, setTempTotal] = useState<number>(0);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await fetch("/api/admin/payments");
            const data = await res.json();
            if (data.payments) setPayments(data.payments);
        } catch (error) {
            console.error("Error fetching payments");
        } finally {
            setLoading(false);
        }
    };

    // 👇 1. START EDITING
    const startEditing = (payment: any) => {
        setEditingId(payment._id);
        setTempPaid(payment.amount);
        setTempTotal(payment.actualTotalFee); // Uses the calculated fee from backend
    };

    // 👇 2. SAVE FEE CHANGES
    const saveFee = async (payment: any) => {
        if (!payment.userId) {
            alert("Error: User not found linked to this payment.");
            return;
        }

        try {
            const res = await fetch("/api/admin/update-fee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: payment.userId,
                    courseSlug: payment.courseSlug,
                    newPaidAmount: tempPaid,
                    newTotalFee: tempTotal
                })
            });

            if (res.ok) {
                setEditingId(null);
                fetchPayments(); // Refresh data
                alert("Fee Updated Successfully!");
            } else {
                alert("Update Failed");
            }
        } catch (error) { alert("Server Error"); }
    };

    // 👇 3. APPROVE/REJECT HANDLERS
    const handleStatusChange = async (id: string, action: "approve" | "reject") => {
        if (!confirm(`Are you sure you want to ${action.toUpperCase()} this payment?`)) return;

        setProcessingId(id);
        try {
            const res = await fetch("/api/payment/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId: id, action: action }),
            });

            if (res.ok) {
                fetchPayments(); // Refresh list instead of reload
            }
        } catch (error) { alert("Error processing request"); }
        finally { setProcessingId(null); }
    };

    // Filter Logic
    const filteredPayments = payments.filter((p: any) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.trxId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 flex items-center gap-2"><Loader2 className="animate-spin text-blue-600" /> Loading Payments...</div>;

    return (
        <div className="p-6 space-y-6">

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fee Verification</h1>
                    <p className="text-slate-500">Verify Trx IDs and Manage Fees.</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, email, trx..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 w-full md:w-64"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-[800px] text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">Student Info</th>
                                <th className="p-4">Course</th>
                                <th className="p-4">Trx Details</th>
                                <th className="p-4 bg-blue-50 text-blue-700 border-l border-blue-100">Fee Status (Paid / Total)</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPayments.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No pending payments found.</td></tr>
                            ) : (
                                filteredPayments.map((p) => {
                                    const isEditing = editingId === p._id;
                                    const isPaidFull = p.amount >= p.actualTotalFee;

                                    return (
                                        <tr key={p._id} className="border-b hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{p.name || p.studentName}</div>
                                                <div className="text-xs text-slate-400">{p.email}</div>
                                            </td>
                                            <td className="p-4 font-medium">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                                                    {p.courseTitle || p.courseSlug}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-mono font-bold text-slate-700">{p.trxId}</div>
                                                <div className="text-[10px] uppercase text-slate-400 mt-1">{p.method}</div>
                                                {p.image && <a href={p.image} target="_blank" className="text-[10px] text-blue-600 underline">View Proof</a>}
                                            </td>

                                            {/* 👇 EDITABLE FEE SECTION */}
                                            <td className="p-4 bg-blue-50/30 border-l border-blue-100">
                                                {isEditing ? (
                                                    <div className="flex flex-col gap-2 bg-white p-2 rounded border border-blue-200 shadow-sm">
                                                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                                            <span>Paid:</span>
                                                            <input type="number" value={tempPaid} onChange={e => setTempPaid(Number(e.target.value))} className="w-20 p-1 border rounded text-black" />
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                                                            <span>Total:</span>
                                                            <input type="number" value={tempTotal} onChange={e => setTempTotal(Number(e.target.value))} className="w-20 p-1 border rounded text-black" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span className={isPaidFull ? "font-bold text-green-600 text-lg" : "font-bold text-slate-700 text-lg"}>Rs {p.amount}</span>
                                                        <span className="text-xs text-slate-400 mx-1">/</span>
                                                        <span className="text-sm font-medium text-slate-500">{p.actualTotalFee}</span>

                                                        {!isPaidFull && (
                                                            <div className="text-[10px] text-orange-500 font-bold mt-1">
                                                                Pending: {(p.actualTotalFee - p.amount).toLocaleString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="p-4 text-center">
                                                {isEditing ? (
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => saveFee(p)} className="bg-green-600 text-white p-1.5 rounded hover:bg-green-700 shadow" title="Save"><Save size={16} /></button>
                                                        <button onClick={() => setEditingId(null)} className="bg-gray-300 text-gray-700 p-1.5 rounded hover:bg-gray-400" title="Cancel"><X size={16} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center items-center gap-2">
                                                        {/* Edit Button */}
                                                        <button onClick={() => startEditing(p)} className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors border border-blue-200" title="Edit Amount">
                                                            <Edit size={16} />
                                                        </button>

                                                        {/* Approve/Reject Buttons */}
                                                        {p.status === 'pending' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(p._id, "approve")}
                                                                    disabled={!!processingId}
                                                                    className="bg-green-600 text-white p-1.5 rounded hover:bg-green-700 shadow-sm disabled:opacity-50"
                                                                    title="Approve"
                                                                >
                                                                    {processingId === p._id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(p._id, "reject")}
                                                                    disabled={!!processingId}
                                                                    className="bg-red-100 text-red-600 p-1.5 rounded hover:bg-red-200 disabled:opacity-50"
                                                                    title="Reject"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {p.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}