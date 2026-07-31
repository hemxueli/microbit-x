import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, message: "❌ 请输入邮箱" }, { status: 400 });
    }

    // 生成 6 位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 保存到 reset_codes 表
    const { error: insertError } = await supabase
      .from("reset_codes")
      .insert({
        email,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 分钟有效
      });

    if (insertError) {
      return NextResponse.json({ success: false, message: `❌ ${insertError.message}` }, { status: 400 });
    }

    // 发邮件（这里用 Supabase 内置的邮件功能或你自己的邮件服务）
    // 示例：console.log(`发送邮件到 ${email}，验证码是 ${code}`);

    return NextResponse.json({ success: true, message: "✅ 验证码已发送，请检查邮箱" });
  } catch {
    return NextResponse.json({ success: false, message: "❌ 服务器错误" }, { status: 500 });
  }
}
