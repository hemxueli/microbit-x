"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Student {
  name: string;
}

interface Class {
  name: string;
  students: Student[];
}

export default function ClassesPage() {
  const { t } = useI18n();
  const [classes, setClasses] = useState<Class[]>([]);
  const [newClass, setNewClass] = useState("");

  const addClass = () => {
    if (newClass.trim() !== "") {
      setClasses([...classes, { name: newClass, students: [] }]);
      setNewClass("");
    }
  };

  const addStudent = (classIndex: number, studentName: string) => {
    if (studentName.trim() !== "") {
      const updatedClasses = [...classes];
      updatedClasses[classIndex].students.push({ name: studentName });
      setClasses(updatedClasses);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">{t("teacher.classesTitle")}</h1>
      <p className="text-center text-gray-600 mb-10">{t("teacher.classesDescription")}</p>

      {/* 创建班级 */}
      <Card className="max-w-lg mx-auto mb-8 bg-white shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>{t("teacher.createClass")}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder={t("teacher.enterClassName")}
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          />
          <Button onClick={addClass}>{t("teacher.createClass")}</Button>
        </CardContent>
      </Card>

      {/* 班级列表 */}
      <div className="grid md:grid-cols-2 gap-6">
        {classes.length === 0 ? (
          <p className="text-center text-gray-500">{t("teacher.noClasses")}</p>
        ) : (
          classes.map((cls, index) => (
            <Card key={index} className="rounded-xl shadow-md bg-white">
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder={t("teacher.enterStudentName")}
                    id={`student-${index}`}
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById(
                        `student-${index}`
                      ) as HTMLInputElement;
                      addStudent(index, input.value);
                      input.value = "";
                    }}
                  >
                    {t("teacher.addStudent")}
                  </Button>
                </div>
                {cls.students.length > 0 && (
                  <ul className="list-disc pl-5">
                    {cls.students.map((student, sIndex) => (
                      <li key={sIndex}>{student.name}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
