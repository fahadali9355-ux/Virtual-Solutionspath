import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { courses } from "@/lib/courseData"; // 👈 Purani file se data uthaya

export async function GET() {
  try {
    await connectDB();

    // Pehle check karo k database khali hai ya nahi?
    // Agar khali nahi hai, to hum duplicate nahi banayenge.
    const count = await Course.countDocuments();
    
    if (count > 0) {
        return NextResponse.json({ message: "Database already has courses!" });
    }

    // Saare courses database main daal do
    await Course.insertMany(courses);

    return NextResponse.json({ message: "SUCCESS! All 9 courses imported to Database. 🎉" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}