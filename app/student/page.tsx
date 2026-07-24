"use client";
import { useI18n } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";

// 动态加载 MakeCode iframe
const MakeCodeEmbed = ({ url }: { url: string }) => (
  <iframe
    src={url}
    style={{ width: "100%", height: "500px", border: "1px solid #ccc", borderRadius: "8px" }}
    allow="fullscreen"
  />
);

export default function StudentPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">{t("student.welcome")}</h1>
      <p className="text-center text-gray-600 mb-10">{t("student.description")}</p>

      {/* 学习模块 */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {["basic", "input", "music"].map((topic) => (
          <Card key={topic} className="bg-white shadow-md rounded-xl">
            <CardHeader>
              <CardTitle>{t(`student.${topic}`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t(`student.${topic}Desc`)}</p>
              <MakeCodeEmbed url={`https://makecode.microbit.org/---run?id=${topic}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 挑战模块 */}
      <h2 className="text-2xl font-bold mb-6">{t("student.challenges")}</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {["easy", "medium", "hard"].map((level) => (
          <Card key={level} className="bg-white shadow-md rounded-xl">
            <CardHeader>
              <CardTitle>{t(`student.${level}`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t(`student.${level}Desc`)}</p>
              <MakeCodeEmbed url={`https://makecode.microbit.org/---run?id=${level}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI 聊天助手 */}
      <Card className="bg-white shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>{t("student.aiAssistant")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t("student.aiAssistantDesc")}</p>
          {/* TODO: 接入 AI 聊天组件 */}
          <div className="border p-4 rounded-md bg-gray-50">
            <p className="text-gray-500">[AI Chat Assistant Placeholder]</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
