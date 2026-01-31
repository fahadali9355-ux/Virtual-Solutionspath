import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 👇 1. FIXED ADMIN LOGIN (Yahan Magic Hoga)
    // Agar ye email aur password match hua, to direct Admin access milegi.
    if (email === "virtualsolutios.path@gmail.com" && password === "Virtual@123") {
      return NextResponse.json({
        message: "Welcome Admin! 👑",
        user: {
          name: "Super Admin",
          email: "virtualsolutios.path@gmail.com",
          role: "admin", // 👈 Ye role frontend ko batayega k ye admin hai
          image: ""
        },
      }, { status: 200 });
    }

    // 👇 2. NORMAL STUDENT LOGIN (Database Check)
    await connectDB();

    // User dhoondo
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid Credentials!" }, { status: 401 });
    }

    // Agar sab theek hai to user wapis bhejo
    return NextResponse.json({
      message: "Login Successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role || "student", // Database wala role
        image: user.image || ""
      },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}