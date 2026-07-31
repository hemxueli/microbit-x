"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setStatus("error");
        setMessage(`❌ ${error.message}`);
      } else {
        setStatus("success");
        setMessage("✅ 密码已成功更新，请重新登录。");
      }
    } catch {
      setStatus("error");
      setMessage("❌ 服务器错误，请稍后再试。");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-teal-700">重置密码</h1>
        <p className="text-gray-600 mb-6">请输入新密码。</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="新密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? "提交中..." : "更新密码"}
          </Button>
        </form>

        {message && (
          <div
            className={`mt-4 text-sm p-2 rounded ${
              status === "success"
                ? "bg-teal-100 text-teal-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
