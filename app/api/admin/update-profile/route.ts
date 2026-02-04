import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId, email, password } = await req.json();
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Agar email change ho rahi hai, to check karo k kisi aur ki to nahi
    if (email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use by another account" }, { status: 400 });
        }
        user.email = email;
    }

    // Agar password bhi bheja gaya hai to update karo
    if (password && password.trim() !== "") {
        user.password = password; 
    }

    await user.save();

    return NextResponse.json({ message: "Profile Updated Successfully!" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}