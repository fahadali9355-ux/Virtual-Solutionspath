import { NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Database se connect karo
    await connectDB();

    // 2. User ko email se dhoondo
    const user = await User.findOne({ email });

    // Agar user na mile
    if (!user) {
      return NextResponse.json({ message: "Ye email register nahi hai." }, { status: 400 });
    }

    // 3. Password match karo
    // (Filhal hum direct check kar rahe hain, baad main isay secure karenge)
    if (user.password !== password) {
      return NextResponse.json({ message: "Password ghalat hai!" }, { status: 400 });
    }

    // 4. Sab theek hai! Success message bhejo
    return NextResponse.json({ message: "Login Successful!", user: user.name }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Error logging in." }, { status: 500 });
  }
}