import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ success: false, error: "MISSING_ID" })
    }

    const { error } = await supabase.from("quiz_results").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ success: false, error: "DELETE_FAILED" })
    }

    return NextResponse.json({ success: true, id })
  } catch {
    return NextResponse.json({ success: false, error: "SERVER_ERROR" })
  }
}
