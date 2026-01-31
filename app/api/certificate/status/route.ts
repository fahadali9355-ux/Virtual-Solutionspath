import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CertificateRequest from "@/models/CertificateRequest";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    // User ki saari requests utha lao
    const requests = await CertificateRequest.find({ email });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}