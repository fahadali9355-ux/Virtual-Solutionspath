import { NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();
    await connectDB();

    const user = await User.findOne({ 
      email, 
      resetPasswordToken: code, 
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update User
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Code delete kardo use hone k baad
    user.resetPasswordExpire = undefined;
    await user.save();

    return NextResponse.json({ message: "Password Changed Successfully" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error resetting password" }, { status: 500 });
  }
}