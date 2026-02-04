import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json();

    // 1. Transporter (Woh system jo email bhejega)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Apki Gmail (jo .env.local main hai)
        pass: process.env.EMAIL_PASS, // Apka App Password
      },
    });

    // 2. Email ka content (Jo apko receive hogi)
    const mailOptions = {
      from: process.env.EMAIL_USER, // Bhejne wala (System)
      to: process.env.EMAIL_USER,   // Receive karne wala (Aap khud)
      subject: `New Inquiry from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #082F49;">New Message from VSP Website</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #0284C7;">${message}</p>
        </div>
      `,
    };

    // 3. Email Bhejo
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email Sent Successfully!" });

  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ success: false, message: "Failed to send email" }, { status: 500 });
  }
}