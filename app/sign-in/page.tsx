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
    </div>
  );
}
