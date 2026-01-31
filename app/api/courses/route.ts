import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const existing = await Course.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: "Course with this slug already exists!" }, { status: 400 });
    }

    const newCourse = await Course.create(body);
    
    return NextResponse.json({ message: "Course Added Successfully!", course: newCourse }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json({ courses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // Frontend humein ID bhejega
    await connectDB();

    await Course.findByIdAndDelete(id); // Database se ura do

    return NextResponse.json({ message: "Course Deleted Successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}