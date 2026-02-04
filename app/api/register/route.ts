import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // 👈 Ye library zaroori hai

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();
    await connectDB();

    // 1. Check karo user pehle se to nahi hai?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email!" }, { status: 400 });
    }

    // 2. PASSWORD HASHING (Sab se Zaroori Step) 🔒
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. User Save karo
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword, // 👈 Hash wala password save hoga
      role: "student" // Default role student
    });

    return NextResponse.json({ message: "Account Created Successfully!" }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}