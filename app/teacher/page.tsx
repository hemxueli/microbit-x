"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function TeacherPage() {
  const { t } = useI18n();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("teacher.classes");

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch("/api/classes");
        const data = await res.json();
        setClasses(data);
      } catch (err) {
        console.error("加载班级失败:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, []);

  if (loading) return <p className="text-gray-500">{t("common.loading")}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold">{t("teacher.dashboard")}</h1>
        <div className="flex items-center gap-4">
          {/* 老师头像和名字（从 session 获取） */}
          <div className="flex items-center gap-2">
            <img
              src="/default-avatar.png"
              alt="avatar"
              className="w-10 h-10 rounded-full border"
            />
            <span className="font-medium">张老师</span>
          </div>
          <button className="text-red-600">{t("nav.logout")}</button>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="p-6 max-w-5xl mx-auto">
        {/* Tab 切换 */}
        <div className="flex gap-4 border-b mb-6">
          {["teacher.classes", "teacher.progress", "teacher.reviewMarks", "teacher.students"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600"
                }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>

        {/* 班级管理 */}
        {activeTab === "teacher.classes" && (
          <div>
            <Link href="/teacher/classes/new">
              <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
                {t("teacher.createClass")}
              </button>
            </Link>

            {classes.length === 0 ? (
              <p className="text-gray-500">{t("teacher.noClasses")}</p>
            ) : (
              <ul className="space-y-4">
                {classes.map((cls) => (
                  <li
                    key={cls.id}
                    className="p-4 border rounded shadow-sm hover:shadow-md"
                  >
                    <h3 className="text-lg font-bold">{cls.name}</h3>
                    <p className="text-gray-600">{cls.description ?? "—"}</p>
                    <p className="mt-2">
                      {t("teacher.shareCode")}:{" "}
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {cls.joinCode}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* 学生进度 */}
        {activeTab === "teacher.progress" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">{t("teacher.progress")}</h2>
            <p className="text-gray-600">{t("teacher.avgScore")}, {t("teacher.attempts")}</p>
          </div>
        )}

        {/* 成绩审阅 */}
        {activeTab === "teacher.reviewMarks" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">{t("teacher.reviewMarks")}</h2>
            <p className="text-gray-600">{t("teacher.noAttempts")}</p>
          </div>
        )}

        {/* 学生名单 */}
        {activeTab === "teacher.students" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">{t("teacher.students")}</h2>
            <p className="text-gray-600">{t("teacher.noStudents")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
