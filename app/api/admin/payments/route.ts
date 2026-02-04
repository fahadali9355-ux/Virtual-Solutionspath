import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Course from "@/models/Course";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // 1. Fetch Payments, Courses, and Users (Parallel for speed)
    const [payments, courses, users] = await Promise.all([
      Payment.find({}).sort({ createdAt: -1 }).lean(),
      Course.find({}).lean(),
      User.find({}).select("_id email").lean() // User ID is needed for updates
    ]);

    // 2. Enrich Data (Calculate Total Fee Logic)
    const enrichedPayments = payments.map((p: any) => {
        
        // Find Course Price
        const course: any = courses.find((c: any) => c.slug === p.courseSlug);
        
        // Find User ID (Match by email)
        const user: any = users.find((u: any) => u.email === p.email);

        // --- FEE CALCULATION LOGIC ---
        // Priority 1: Admin's Custom Set Fee
        const adminPrice = p.customTotalFee ? Number(p.customTotalFee) : 0;
        // Priority 2: Original Course Price from DB
        const coursePrice = course?.price ? Number(course.price) : 0;
        
        let finalTotal = 5000; // Default fallback
        if (adminPrice > 0) finalTotal = adminPrice;
        else if (coursePrice > 0) finalTotal = coursePrice;

        return {
            ...p,
            userId: user?._id || null, // Important for the update API
            courseTitle: course?.title || p.courseSlug,
            actualTotalFee: finalTotal // ✅ Calculated Fee
        };
    });

    return NextResponse.json({ payments: enrichedPayments });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}