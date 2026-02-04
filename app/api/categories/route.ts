import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();
    
    // distinct("category") duplicate naam nahi lay ga
    const categories = await Course.distinct("category");

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  }
}