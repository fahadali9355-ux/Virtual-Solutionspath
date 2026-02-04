import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CertificateRequest from "@/models/CertificateRequest"; // Make sure model exists
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // Requests laayen aur sath hi User ka data bhi populate karein
    // "studentEmail" ya "userId" jo bhi foreign key hai us se link karein
    // Yahan hum assume kar rahay hain k CertificateRequest main 'email' field common hai
    
    // Note: Mongoose main virtual populate ya manual fetch karna padega agar direct ref nahi hai
    // Hum simple tareeqay se requests la kar users dhoondte hain
    
    const requests = await CertificateRequest.find().sort({ createdAt: -1 });
    
    // Har request k liye user ka data dhoondo
    const requestsWithUserData = await Promise.all(requests.map(async (req) => {
        const user = await User.findOne({ email: req.email }).select("feeRecords name email");
        return {
            ...req._doc, // Request ka data
            user: user   // User ka data (Fee check karne k liye)
        };
    }));

    return NextResponse.json({ requests: requestsWithUserData });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Status Update API (Approve/Reject)
export async function PUT(req: Request) {
    try {
        const { id, status } = await req.json();
        await connectDB();
        await CertificateRequest.findByIdAndUpdate(id, { status });
        return NextResponse.json({ message: "Updated" });
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}