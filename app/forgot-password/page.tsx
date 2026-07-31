"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">忘记密码</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="请输入邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-teal-600 text-white p-2 w-full">
          发送验证码
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
