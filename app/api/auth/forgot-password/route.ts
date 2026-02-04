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

    // 3. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "virtualsolutions.path@gmail.com", // 👈 Apna Gmail
        pass: "xazflnjirgujnqwj",    // 👈 App Password
      },
    });

    // 👇 PROFESSIONAL HTML EMAIL TEMPLATE
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
          .container { max-w-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { background-color: #082F49; padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px; }
          .content { padding: 40px 30px; text-align: center; color: #334155; }
          .greeting { font-size: 18px; margin-bottom: 20px; color: #0F172A; }
          .code-box { background-color: #F0F9FF; border: 2px dashed #0EA5E9; border-radius: 8px; padding: 20px; margin: 30px 0; display: inline-block; }
          .code { font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #0284C7; display: block; }
          .expiry { font-size: 14px; color: #64748B; margin-top: 10px; }
          .warning { font-size: 13px; color: #94A3B8; margin-top: 30px; border-top: 1px solid #E2E8F0; padding-top: 20px; }
          .footer { background-color: #F8FAFC; padding: 20px; text-align: center; font-size: 12px; color: #94A3B8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Virtual Solution Path</h1>
          </div>
          
          <div class="content">
            <p class="greeting">Hi there,</p>
            <p>We received a request to reset your password. Use the code below to verify your identity.</p>
            
            <div class="code-box">
              <span class="code">${resetToken}</span>
            </div>
            
            <p class="expiry">This code is valid for <strong>15 minutes</strong> only.</p>
            
            <div class="warning">
              If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </div>
          </div>
          
          <div class="footer">
            &copy; 2026 Virtual Solution Path. All rights reserved.<br>
            Tech City, Pakistan
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"Virtual Solution Path" <virtualsolutions.path@gmail.com>', // 👈 Naam k sath email
      to: email,
      subject: "🔐 Verify your identity - VSP", 
      text: `Hello, Your password reset code is: ${resetToken}. It is valid for 15 minutes. If you did not request this, please ignore this email.`,
      html: emailHtml, 
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}