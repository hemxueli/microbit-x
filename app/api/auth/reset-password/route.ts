import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ success: false, message: "❌ 参数不完整" }, { status: 400 });
    }

    // 查找验证码
    const { data, error } = await supabase
      .from("reset_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: "❌ 验证码错误或已使用" }, { status: 400 });
    }

    // 检查是否过期
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: "❌ 验证码已过期" }, { status: 400 });
    }

    // 更新密码
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      return NextResponse.json({ success: false, message: `❌ ${updateError.message}` }, { status: 400 });
    }

    // 标记验证码已使用
    await supabase.from("reset_codes").update({ used: true }).eq("id", data.id);

    return NextResponse.json({ success: true, message: "✅ 密码已更新" });
  } catch {
    return NextResponse.json({ success: false, message: "❌ 服务器错误" }, { status: 500 });
  }
}
