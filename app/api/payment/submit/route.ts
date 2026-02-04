import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    // Check karo k is Trx ID se pehle to submit nahi hua?
    const existing = await Payment.findOne({ trxId: body.trxId });
    if (existing) {
        return NextResponse.json({ error: "This Transaction ID is already used!" }, { status: 400 });
    }

    await Payment.create(body);

    return NextResponse.json({ message: "Payment Submitted! Wait for approval." }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}