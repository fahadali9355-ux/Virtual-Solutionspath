import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, code }: any) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // .env file se email
      pass: process.env.EMAIL_PASS, // .env file se password
    },
  });

  // 👇 PROFESSIONAL HTML TEMPLATE
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
      
      <div style="background-color: #082F49; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Virtual Solution Path</h1>
      </div>

      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #333333; margin-top: 0;">Verify Your Email</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.5;">
          ${text}
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f0f9ff; color: #082F49; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; border: 2px solid #082F49; letter-spacing: 5px;">
            ${code}
          </span>
        </div>

        <p style="color: #999999; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this, please ignore this email.
        </p>
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999999;">
        &copy; ${new Date().getFullYear()} Virtual Solution Path. All rights reserved.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Virtual Solution Path" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent, // HTML body bhej rahay hain
  });
};