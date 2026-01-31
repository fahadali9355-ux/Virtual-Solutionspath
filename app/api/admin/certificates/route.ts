import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CertificateRequest from "@/models/CertificateRequest";

// 1. GET ALL REQUESTS
export async function GET(req: Request) {
  try {
    await connectDB();
    // Saari requests lao, lekin nayi wali ooper hon (sort by date)
    const requests = await CertificateRequest.find().sort({ requestDate: -1 });
    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. UPDATE STATUS (Approve/Reject)
export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();
    await connectDB();

    // ID se dhoond kar status update karo
    await CertificateRequest.findByIdAndUpdate(id, { status });

    return NextResponse.json({ message: "Status updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}