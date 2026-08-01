import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 用 service role key 才能写入
);

export async function POST(req: Request) {
  try {
    const { user_id, name, role } = await req.json();

    if (!user_id || !name || !role) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (role === "teacher") {
      await supabase.from("teachers").insert({
        id: user_id,
        name,
        created_at: new Date().toISOString(),
      });
    } else {
      await supabase.from("students").insert({
        id: user_id,
        name,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
