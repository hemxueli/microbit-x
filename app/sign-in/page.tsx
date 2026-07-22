"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // 在客户端检查 session，而不是服务端直接 redirect
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data && data.role) {
          // 登录成功后才跳转
          router.push(data.role === "teacher" ? "/teacher" : "/student");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };
    checkSession();
  }, [router]);

  return (
    <div style={{ padding: "20px" }}>
      <AuthShell mode="sign-in" />

      {/* Forgot Password 链接 */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <Link
          href="/forgot-password"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Forgot Password?
        </Link>
      </div>

      {/* Sign up 链接（可选） */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <Link
          href="/sign-up"
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Don’t have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
