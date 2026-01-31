import { NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    await connectDB();

    const user = await User.findOne({ 
      email, 
      resetPasswordToken: code, 
      resetPasswordExpire: { $gt: Date.now() } // Check agar time baqi hai
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or Expired Code" }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}