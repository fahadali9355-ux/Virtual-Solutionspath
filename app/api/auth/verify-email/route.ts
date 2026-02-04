import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User already verified" });
    }

    // Check Code and Expiry
    if (user.verificationCode !== code || user.verificationCodeExpire < Date.now()) {
      return NextResponse.json({ error: "Invalid or Expired Code" }, { status: 400 });
    }

    // Verify User
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;
    await user.save();

    return NextResponse.json({ message: "Email Verified Successfully!" });

  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}