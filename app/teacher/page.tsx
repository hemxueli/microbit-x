"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LANGS, useI18n } from "@/lib/i18n";

export default function TeacherPage() {
  const { t, setLang } = useI18n();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("classes");

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
    <div className="p-6 max-w-4xl mx-auto">
      {/* 顶部语言切换 */}
      <div className="flex gap-3 mb-6">
        {LANGS.map((lang) => (
          <button
            key={lang.code}
            className="px-3 py-1 rounded text-white shadow"
            style={{
              backgroundColor:
                lang.code === "en"
                  ? "#2563eb"
                  : lang.code === "ms"
                  ? "#16a34a"
                  : "#dc2626",
            }}
            onClick={() => setLang(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-4 border-b mb-6">
        {["teacher.classes", "teacher.assignments", "teacher.quiz", "teacher.students"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${
              activeTab === tab
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

      {/* 作业布置 */}
      {activeTab === "teacher.assignments" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{t("teacher.assignments")}</h2>
          <p className="text-gray-600">{t("teacher.assignmentsDesc")}</p>
        </div>
      )}

      {/* 测验查看 */}
      {activeTab === "teacher.quiz" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{t("teacher.quiz")}</h2>
          <p className="text-gray-600">{t("teacher.quizDesc")}</p>
        </div>
      )}

      {/* 学生名单 */}
      {activeTab === "teacher.students" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{t("teacher.students")}</h2>
          <p className="text-gray-600">{t("teacher.studentsDesc")}</p>
        </div>
      )}
    </div>
  );
}
