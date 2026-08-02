"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { supabase } from "@/lib/supabaseClient";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setLoading(false);
        return;
      }

      if (user) {
        // 优先用 user_metadata.role 判断
        const role = user.user_metadata?.role;

        if (role === "teacher") {
          router.push("/teacher");
        } else if (role === "student") {
          router.push("/student");
        } else {
          // 如果 role 没有值，用数据库兜底
          const { data: teacher } = await supabase
            .from("teachers")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

          if (teacher) {
            router.push("/teacher");
          } else {
            router.push("/student");
          }
        }
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  return (
    <div style={{ padding: "20px" }}>
      {/* 登录表单 */}
      <AuthShell mode="sign-in" />

      {/* 可选：加载状态 */}
      {loading && <p>Checking session...</p>}
    </div>
  );
}
