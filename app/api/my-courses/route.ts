import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course"; // Make sure Course model exists

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    // 1. User dhoondo
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. User k enrolled slugs (IDs) uthao
    const enrolledSlugs = user.enrolledCourses || [];

    if (enrolledSlugs.length === 0) {
      return NextResponse.json({ courses: [] });
    }

    // 3. Database se Courses nikalo jo in slugs se match karein
    const courses = await Course.find({ 
      slug: { $in: enrolledSlugs } 
    });

    return NextResponse.json({ courses });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}