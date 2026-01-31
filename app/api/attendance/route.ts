import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// 1. Attendance Barhanay (Mark) k liye
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Attendance +1 kar do
    user.classesAttended += 1;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      classesAttended: user.classesAttended 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error marking attendance" }, { status: 500 });
  }
}

// 2. Current Attendance Pata Karne k liye (Dashboard Load par)
export async function PUT(req: Request) {
    try {
      const { email } = await req.json();
      await connectDB();
  
      const user = await User.findOne({ email });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  
      return NextResponse.json({ classesAttended: user.classesAttended }, { status: 200 });
  
    } catch (error) {
      return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
    }
  }