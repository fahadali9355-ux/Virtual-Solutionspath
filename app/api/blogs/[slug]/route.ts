import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextRequest, NextResponse } from "next/server";

// GET: Single blog by slug
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> }
) {
    await connectDB();
    const { slug } = await context.params;
    const blog = await Blog.findOne({ slug, published: true });
    if (!blog) return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    return NextResponse.json({ blog });
}
