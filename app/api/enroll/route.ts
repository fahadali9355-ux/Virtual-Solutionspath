import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // 👈 بریکٹس { } کا خاص خیال رکھیں
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, courseId } = await req.json();

    await connectDB(); // کنکشن جوڑیں

    // 1. User ڈھونڈیں
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    // 2. چیک کریں کہ پہلے سے انرول تو نہیں؟
    // (slug بھیج رہے ہیں تو وہ سٹرنگ ہے، اس لیے یہ چیک کام کرے گا)
    if (user.enrolledCourses.includes(courseId)) {
      return NextResponse.json({ message: "You are already enrolled in this course! 🎉" }, { status: 400 });
    }

    // 3. کورس ایڈ کریں
    user.enrolledCourses.push(courseId);
    await user.save();

    return NextResponse.json({ message: "Enrollment Successful! 🚀" }, { status: 200 });

  } catch (error: any) {
    console.error("Enrollment API Error:", error); // ٹرمینل میں ایرر دکھائے گا
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}