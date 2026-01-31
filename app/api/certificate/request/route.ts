import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CertificateRequest from "@/models/CertificateRequest";

// 1. Apply for Certificate (POST)
export async function POST(req: Request) {
  try {
    const { studentName, email, courseId, courseTitle } = await req.json();
    await connectDB();

    // Check karo pehle se request to nahi bheji?
    const existing = await CertificateRequest.findOne({ email, courseId });
    if (existing) {
      return NextResponse.json({ message: "Request already submitted!" }, { status: 400 });
    }

    // Nayi Request banao
    await CertificateRequest.create({
      studentName,
      email,
      courseId,
      courseTitle,
      status: "pending" // Default pending
    });

    return NextResponse.json({ message: "Application Submitted Successfully!" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. Check Status (GET)
export async function POST_STATUS(req: Request) { 
  // Next.js main GET body read nahi karta, isliye hum isay bhi POST rakhenge ya URL params use karenge.
  // Asani k liye hum aik nayi file banayenge status check karne k liye, 
  // filhal isi ko simplificity k liye client side logic par chorhte hain.
  return NextResponse.json({ message: "Use separate route for fetching" });
}