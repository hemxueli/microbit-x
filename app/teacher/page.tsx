"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TeacherPage() {
  const { t } = useI18n(); // ✅ 不传参数，避免红色波浪

  const navItems = [
    { href: "/teacher/classes", label: t("teacher.classes"), color: "bg-blue-600" },
    { href: "/teacher/progress", label: t("teacher.progress"), color: "bg-green-600" },
    { href: "/teacher/evaluation", label: t("teacher.evaluation"), color: "bg-yellow-500" },
    { href: "/teacher/assignments", label: t("teacher.assignments"), color: "bg-purple-600" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">{t("teacher.welcome")}</h1>
      <p className="text-center text-gray-600 mb-10">{t("teacher.dashboardDescription")}</p>

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
                <p className="text-sm opacity-80">{t("teacher.clickToOpen")}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
