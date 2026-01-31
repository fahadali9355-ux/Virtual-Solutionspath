import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sirf enrolled courses wapis bhejo
    return NextResponse.json({ enrolledCourses: user.enrolledCourses }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}