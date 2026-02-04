import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// 1. GET USER DETAILS
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data including image
    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        image: user.image || "", // 👇 Agar null ho to empty string bhejo
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

    // 👇 DEBUG: Terminal main check karein k data araha hai ya nahi
    console.log("--------------------------------");
    console.log("⚡ Update Request for:", email);
    if (image) {
        console.log("📸 Image Data Received (Length):", image.length);
    } else {
        console.log("⚠️ No Image Data Received");
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // --- PASSWORD CHANGE LOGIC ---
    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password!" }, { status: 400 });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // --- UPDATE FIELDS ---
    user.name = name;
    user.phone = phone;

    // 👇 IMAGE UPDATE: Explicitly set karein
    if (image !== undefined) {
       user.image = image; 
       // Note: Mongoose automatically detects changes, but agar issue aye tu:
       user.markModified('image'); 
    }

    const savedUser = await user.save(); // 💾 Save to MongoDB

    console.log("✅ User Saved Successfully. Image stored:", savedUser.image ? "YES" : "NO");
    console.log("--------------------------------");

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        image: savedUser.image,
      },
    });

  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}