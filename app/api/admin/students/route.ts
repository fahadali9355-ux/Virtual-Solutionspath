import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Sirf students lao, password mat bhejo, latest pehle
    const students = await User.find({ role: "student" })
      .select("-password") // Security: Password hide karo
      .sort({ createdAt: -1 });

    return NextResponse.json({ students });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}