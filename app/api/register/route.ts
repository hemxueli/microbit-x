import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key，只能在服务端用
);

export async function POST(req: Request) {
  try {
    const { user_id, name, role } = await req.json();

    if (!user_id || !name || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const payload = {
      user_id,
      name,
      avatar: "/images/default-avatar.png",
      created_at: new Date().toISOString(),
    }

    if (role === "teacher") {
      const { error } = await supabase.from("teachers").upsert(payload)
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    } else if (role === "student") {
      const { error } = await supabase.from("students").upsert({ ...payload, class_id: null })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
