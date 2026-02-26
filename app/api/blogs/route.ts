import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

// GET: Published blogs only (public)
export async function GET() {
    await connectDB();
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    return NextResponse.json({ blogs });
}
