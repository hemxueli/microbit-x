"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!code || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 调用后端 API 验证 code 并更新密码
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/sign-in");
      } else {
        setError(data.message || "Reset failed.");
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
              Reset Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={code}
                placeholder="Enter verification code"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                type="password"
                value={password}
                placeholder="New password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                type="password"
                value={confirm}
                placeholder="Confirm new password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
            {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
