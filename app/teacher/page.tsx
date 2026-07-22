"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TeacherPage() {
  const { t } = useI18n();

  const navItems = [
    {
      href: "/teacher/classes",
      label: t("teacher.classes"),
      description: t("teacher.classesDesc"),
      color: "bg-blue-100 text-blue-900",
    },
    {
      href: "/teacher/progress",
      label: t("teacher.progress"),
      description: t("teacher.progressDesc"),
      color: "bg-green-100 text-green-900",
    },
    {
      href: "/teacher/evaluation",
      label: t("teacher.evaluation"),
      description: t("teacher.evaluationDesc"),
      color: "bg-yellow-100 text-yellow-900",
    },
    {
      href: "/teacher/assignments",
      label: t("teacher.assignments"),
      description: t("teacher.assignmentsDesc"),
      color: "bg-purple-100 text-purple-900",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">{t("teacher.welcome")}</h1>
      <p className="text-center text-gray-600 mb-10">{t("teacher.dashboardDescription")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card
              className={`cursor-pointer hover:scale-105 transition rounded-xl shadow-md ${item.color}`}
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
