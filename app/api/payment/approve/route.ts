import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { paymentId, action, verifiedAmount } = await req.json(); 
    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) return NextResponse.json({ error: "Record not found" }, { status: 404 });

    if (action === "approve") {
        payment.status = "approved";
        
        // Admin verified amount or existing amount
        const amountReceived = verifiedAmount ? Number(verifiedAmount) : Number(payment.amount);
        payment.amount = amountReceived.toString();
        await payment.save();

        // --- USER UPDATE LOGIC ---
        const user = await User.findOne({ email: payment.email });
        
        if (user) {
            // 1. Fee Record Update
            // Check agar pehle se record hai
            const existingRecord = user.feeRecords.find((r: any) => r.courseSlug === payment.courseSlug);
            
            if (existingRecord) {
                // Balance Update
                existingRecord.paidAmount = Number(existingRecord.paidAmount) + amountReceived;
            } else {
                // New Record
                user.feeRecords.push({
                    courseSlug: payment.courseSlug,
                    totalFee: 5000, // Default Total Fee
                    paidAmount: amountReceived,
                    discount: 0
                });
            }

            // 2. ENROLLMENT LOGIC (Ye zaroori hai)
            // Agar course enrolled list main nahi hai, to daal do
            if (!user.enrolledCourses.includes(payment.courseSlug)) {
                user.enrolledCourses.push(payment.courseSlug);
            }

            // 👇 YE LINE MAGIC KAREGI (Database ko force karegi update k liye)
            user.markModified('feeRecords');
            user.markModified('enrolledCourses');
            
            await user.save();
        }
    } else {
        payment.status = "rejected";
        await payment.save();
    }

    return NextResponse.json({ message: `Payment ${action}d successfully!` });

  } catch (error: any) {
    console.error("Approve Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}