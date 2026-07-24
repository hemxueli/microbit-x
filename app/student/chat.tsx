"use client";
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "student", text: input }]);

    const res = await fetch("/api/student/chat", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    setInput("");
  };

  return (
    <div className="border p-4 rounded-md bg-white shadow-md">
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((m, i) => (
          <p
            key={i}
            className={`p-2 rounded ${
              m.role === "student" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"
            }`}
          >
            <strong>{m.role === "student" ? "You" : "AI"}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
