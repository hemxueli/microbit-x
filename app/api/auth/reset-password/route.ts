import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, code, password } = await req.json();
  if (!email || !code || !password) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  // TODO: 从数据库取出验证码并验证
  // const record = await db.resetCodes.findOne({ email, code });
  // if (!record || record.expiresAt < Date.now()) {
  //   return NextResponse.json({ success: false, message: "Invalid or expired code" });
  // }

  // TODO: 更新用户密码
  // await db.users.update({ email }, { password: hash(password) });

  return NextResponse.json({ success: true });
}
