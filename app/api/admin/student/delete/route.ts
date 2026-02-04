import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import CertificateRequest from "@/models/CertificateRequest"; // Agar ye model hai tu

export async function POST(req: Request) {
  try {
    const { studentId } = await req.json();
    await connectDB();

    // 1. Pehle Student ko dhoondo taa k Email mil sake
    const user = await User.findById(studentId);
    if (!user) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // 2. Us student ki SAARI PAYMENTS delete karo (Email se link hoti hain)
    await Payment.deleteMany({ email: user.email });

    // 3. Agar Certificate Requests hain tu wo bhi delete karo
    // (Agar CertificateRequest model exist karta hai)
    try {
        await CertificateRequest.deleteMany({ email: user.email });
    } catch (e) {
        console.log("Certificate table not found or empty");
    }

    // 4. Akhir main USER ko delete karo
    await User.findByIdAndDelete(studentId);

    return NextResponse.json({ message: "Student and all related data deleted!" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}