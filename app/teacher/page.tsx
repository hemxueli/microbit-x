"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function TeacherPage() {
  const { t, i18n } = useTranslation();
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

  if (loading) return <p className="text-gray-500">{t("loading")}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 顶部语言切换 */}
      <div className="flex gap-3 mb-6">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => i18n.changeLanguage("en")}
        >
          English
        </button>
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={() => i18n.changeLanguage("ms")}
        >
          Bahasa Melayu
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => i18n.changeLanguage("zh")}
        >
          中文
        </button>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-4 border-b mb-6">
        {["classes", "assignments", "quiz", "students"].map((tab) => (
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
      {activeTab === "classes" && (
        <div>
          <Link href="/teacher/classes/new">
            <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
              {t("createClass")}
            </button>
          </Link>

          {classes.length === 0 ? (
            <p className="text-gray-500">{t("noClasses")}</p>
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
                    {t("joinCode")}:{" "}
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
      {activeTab === "assignments" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{t("assignments")}</h2>
          <p className="text-gray-600">{t("assignmentsDesc")}</p>
        </div>
      )}

      {/* 测验查看 */}
      {activeTab === "quiz" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{t("quiz")}</h2>
          <p className="text-gray-600">{t("quizDesc")}</p>
        </div>
      )}

      {/* 学生名单 */}
      {activeTab === "students" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{t("students")}</h2>
          <p className="text-gray-600">{t("studentsDesc")}</p>
        </div>
      )}
    </div>
  );
}
