"use client";
import { useI18n } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChatBox from "./chat"; // 确保 chat.tsx 在同目录

export default function StudentPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-gradient-to-r from-green-50 to-purple-50 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">{t("student.welcome")}</h1>
      <p className="text-center text-gray-600 mb-10">{t("student.description")}</p>

      {/* 学习模块 ... */}

      {/* 挑战模块 ... */}

      {/* AI 聊天助手 */}
      <Card className="bg-white shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>{t("student.aiAssistant")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t("student.aiAssistantDesc")}</p>
          <ChatBox /> {/* ✅ 放在这里 */}
        </CardContent>
      </Card>
    </main>
  );
}
