import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found with this email" }, { status: 404 });
    }

    // 1. Generate 6 Digit Code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 2. Save Code to DB (Valid for 15 mins)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 Minutes
    await user.save();

    // 3. Send Email (Nodemailer)
    // NOTE: Yahan apni GMAIL aur APP PASSWORD lagayen
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "virtualsolutions.path@gmail.com", // 👈 Apna Gmail likhein
        pass: "xazflnjirgujnqwj",    // 👈 Gmail App Password (Not regular password)
      },
    });

    const mailOptions = {
      from: "VSP Support <no-reply@vsp.com>",
      to: email,
      subject: "Password Reset Code - Virtual Solution Path",
      text: `Your password reset code is: ${resetToken}. It expires in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}