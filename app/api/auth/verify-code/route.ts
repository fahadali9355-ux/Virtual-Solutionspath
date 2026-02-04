import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    console.log("--------------- VERIFY DEBUG START ---------------");
    console.log("📨 Payload received:", { email, code });

    await connectDB();

    // 1. Pehle user dhoondain sirf Email se (Code se nahi)
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found with email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("👤 User Found:", user.email);
    console.log("🔢 DB Code:", user.resetPasswordToken);
    console.log("⏰ DB Expiry:", user.resetPasswordExpire);
    console.log("⌚ Current Time:", Date.now());

    // 2. Code Check (String conversion taa k type mismatch na ho)
    // Trim() is liye taa k agar space ho tu wo bhi hat jaye
    const dbCode = String(user.resetPasswordToken).trim();
    const inputCode = String(code).trim();

    if (dbCode !== inputCode) {
      console.log(`❌ Mismatch! DB: '${dbCode}' vs Input: '${inputCode}'`);
      return NextResponse.json({ error: "Invalid Code" }, { status: 400 });
    }

    // 3. Expiry Check
    // Agar DB main date object hai to .getTime() use karein, agar number hai to direct compare
    const expiryTime = new Date(user.resetPasswordExpire).getTime();
    const currentTime = Date.now();

    if (expiryTime < currentTime) {
      console.log("❌ Code Expired!");
      return NextResponse.json({ error: "Code has expired. Please send again." }, { status: 400 });
    }

    console.log("✅ Code Verified Successfully!");
    console.log("--------------- VERIFY DEBUG END ---------------");

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}