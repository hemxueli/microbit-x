"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // 调用后端 API 发送验证码邮件
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        // 跳转到 reset-password 页面，带上 email
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.message || "Failed to send reset code.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md rounded-xl shadow-lg bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-extrabold text-indigo-700">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter your email address to receive a reset code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                placeholder="your@email.com"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
            {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
            <div className="mt-6 text-center">
              <Link href="/sign-in" className="text-sm text-indigo-600 hover:text-indigo-800 underline">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
