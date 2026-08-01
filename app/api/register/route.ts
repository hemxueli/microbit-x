import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 用 service role key 才能写入数据库
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id, name, role } = await req.json();

    if (!user_id || !name || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (role === "teacher") {
      const { error } = await supabase.from("teachers").insert({
        user_id,   // ← 存 Supabase Auth 的 ID
        name,
        avatar: "/images/default-avatar.png",
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
    } else if (role === "student") {
      const { error } = await supabase.from("students").insert({
        user_id,
        name,
        avatar: "/images/default-avatar.png",
        class_id: null,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
