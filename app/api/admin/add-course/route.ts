import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // 1. Receive Form Data
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    let slug = formData.get("slug") as string; // 👈 Isay 'let' banaya taa k change kar sakein
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const duration = formData.get("duration") as string;
    const lessons = formData.get("lessons") as string;
    const desc = formData.get("desc") as string;
    const curriculumString = formData.get("curriculum") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
        return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // 👇 NEW LOGIC: Agar Slug nahi diya, tu Title se bana lo
    if (!slug || slug.trim() === "") {
        slug = title
            .toLowerCase()             // Chota karein
            .trim()                    // Faltu spaces hatayen
            .replace(/[^\w\s-]/g, '')  // Special chars (@, #, !) hatayen
            .replace(/[\s_-]+/g, '-')  // Spaces ko '-' se badal dein
            .replace(/^-+|-+$/g, '');  // Shuru aur akhir se '-' hatayen
    } else {
        // Agar user ne slug dia hai, tab bhi usay clean karein (no spaces)
        slug = slug.toLowerCase().replace(/\s+/g, "-");
    }

    await connectDB();

    // 2. Upload Image to Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "vsp_courses" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
    });

    // 3. Curriculum wapis Array main convert karo
    let curriculum = [];
    try {
        curriculum = JSON.parse(curriculumString);
    } catch (e) {
        curriculum = [];
    }

    // 4. Save to DB
    const newCourse = new Course({
      title,
      slug, // ✅ Ab ye kabhi khali nahi hoga
      category,
      price,
      duration,
      lessons,
      desc: desc,
      curriculum,
      image: uploadResponse.secure_url,
    });

    await newCourse.save();

    return NextResponse.json({ message: "Course Added Successfully!", slug: slug });

  } catch (error: any) {
    console.error("Add Course Error:", error);
    // Agar duplicate slug ka error aye tu user ko batayen
    if (error.code === 11000) {
        return NextResponse.json({ error: "A course with this name/slug already exists!" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}