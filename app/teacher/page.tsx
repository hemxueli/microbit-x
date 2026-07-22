"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TeacherPage() {
  const { t } = useI18n("teacher");

  const navItems = [
    { href: "/teacher/classes", label: t("classes"), color: "bg-blue-500" },
    { href: "/teacher/progress", label: t("progress"), color: "bg-green-500" },
    { href: "/teacher/evaluation", label: t("evaluation"), color: "bg-yellow-500" },
    { href: "/teacher/assignments", label: t("assignments"), color: "bg-purple-500" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">{t("welcome")}</h1>
      <p className="text-center text-gray-600 mb-10">{t("dashboardDescription")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card
              className={`cursor-pointer hover:scale-105 transition rounded-xl shadow-lg text-white ${item.color}`}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-80">{t("clickToOpen")}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
