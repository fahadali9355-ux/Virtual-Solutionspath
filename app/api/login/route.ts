import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // Agar bcrypt use kar rahay hain

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    
    // Check User & Password
    if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }
    
    // Agar password encrypted hai (bcrypt)
    // const isMatch = await bcrypt.compare(password, user.password);
    
    // Agar simple string password hai (Filhal development k liye)
    const isMatch = password === user.password; 

    if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // 👇 RETURN RESPONSE (Yahan ID bhejna zaroori hai)
    return NextResponse.json({
        message: "Login Successful",
        user: {
            _id: user._id, // 👈 YE CHEEZ ZAROORI HAI
            name: user.name,
            email: user.email,
            role: user.role
        }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}