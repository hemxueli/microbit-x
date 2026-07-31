import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const { error: insertError } = await supabase
      .from("reset_codes")
      .insert({
        email,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    if (insertError) {
      return NextResponse.json({ success: false, message: insertError.message }, { status: 400 });
    }

    // Send email via Resend
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset Code",
      html: `<p>Hello,</p><p>Your reset code is <b>${code}</b></p><p>Valid for 10 minutes.</p>`,
    });

    return NextResponse.json({ success: true, message: "Reset code sent. Please check your email." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
