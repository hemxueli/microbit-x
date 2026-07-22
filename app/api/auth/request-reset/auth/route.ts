import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
  }

  // 生成随机 6 位验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // TODO: 存储到数据库或缓存，带过期时间
  // await db.resetCodes.insert({ email, code, expiresAt: Date.now() + 15*60*1000 });

  // 发邮件
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your password reset code",
    text: `Your reset code is: ${code}`,
  });

  return NextResponse.json({ success: true });
}
