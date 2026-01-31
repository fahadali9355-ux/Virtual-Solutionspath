import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import CertificateRequest from "@/models/CertificateRequest";

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. Count Total Students
    const totalStudents = await User.countDocuments({ role: "student" });

    // 2. Count Requests
    const totalRequests = await CertificateRequest.countDocuments();
    const pendingRequests = await CertificateRequest.countDocuments({ status: "pending" });
    const approvedCertificates = await CertificateRequest.countDocuments({ status: "approved" });

    return NextResponse.json({
      totalStudents,
      totalRequests,
      pendingRequests,
      approvedCertificates
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}