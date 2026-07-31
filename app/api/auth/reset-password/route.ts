import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "❌ 请输入邮箱地址。" },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: `❌ ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "✅ 重置密码邮件已发送，请检查邮箱。" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "❌ 服务器错误，请稍后再试。" },
      { status: 500 }
    );
  }
}
