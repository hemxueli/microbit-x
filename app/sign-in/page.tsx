"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      console.log("session data:", data); // 先打印看看
      if (data?.role) {
        router.push(data.role === "teacher" ? "/teacher" : "/student");
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-2xl font-bold">Sign In</h1>
        <AuthShell mode="sign-in" />
      </div>
    </div>
  );
}
