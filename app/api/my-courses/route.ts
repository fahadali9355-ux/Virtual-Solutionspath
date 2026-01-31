import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // ✅ Brackets k sath
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sirf course ki IDs (slugs) wapis bhejo
    return NextResponse.json({ 
      enrolledCourses: user.enrolledCourses || [] 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}