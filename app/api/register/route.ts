import { NextResponse } from "next/server";
import { connectDB }  from "@/lib/db";   // 👈 اب ہم جدید راستہ استعمال کر رہے ہیں
import User from "@/models/User";   // 👈 یہ بھی جدید راستہ ہے

export async function POST(req: Request) {
  console.log("API Shuru hui..."); // 👇 یہ ٹرمینل میں پرنٹ ہوگا

  try {
    const body = await req.json();
    console.log("Data aaya:", body);

    await connectDB();
    console.log("Database Connect ho gaya!");

    const { name, email, password, phone } = body;

    // Check karo user pehle se to nahi?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    // Naya user banao
    const newUser = await User.create({ name, email, password, phone });
    console.log("User Ban gaya:", newUser);

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });

  } catch (error: any) {
    console.error("ASLI ERROR YE HAI 👉:", error); // 👈 یہ ہمیں اصلی وجہ بتائے گا
    return NextResponse.json({ message: "Error: " + error.message }, { status: 500 });
  }
}