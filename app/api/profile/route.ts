import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// 1. GET USER DETAILS (POST method use kar rahay hain security k liye)
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Password wapis nahi bhejna, sirf zaroori data
    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image, // 👇 Image bhi wapis bhej rahe hain
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. UPDATE PROFILE
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { email, name, phone, image, currentPassword, newPassword } = body;

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- PASSWORD CHANGE LOGIC ---
    if (newPassword) {
      // Agar naya password de raha hai, to purana check karo
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password!" }, { status: 400 });
      }
      // Password hash karke update karo
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // --- NORMAL DETAILS UPDATE ---
    user.name = name || user.name;
    user.phone = phone || user.phone;
    
    // 👇 Image update logic
    if (image) {
        user.image = image;
    }

    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}