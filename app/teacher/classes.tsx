"use client";
import { useState } from "react";

interface Student {
  name: string;
}

interface Class {
  name: string;
  students: Student[];
}

export default function ClassesPage() {
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
    <div style={{ padding: "20px" }}>
      <h1>班级管理</h1>
      <p>老师可以创建班级并添加学生。</p>

      {/* 创建班级 */}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="输入班级名称"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={addClass} style={{ padding: "8px 12px" }}>
          创建班级
        </button>
      </div>

      {/* 班级列表 */}
      <div style={{ marginTop: "30px" }}>
        <h2>已创建的班级</h2>
        {classes.length === 0 ? (
          <p>目前还没有班级。</p>
        ) : (
          <ul>
            {classes.map((cls, index) => (
              <li key={index} style={{ marginBottom: "20px" }}>
                <strong>{cls.name}</strong>

                {/* 添加学生 */}
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="输入学生姓名"
                    id={`student-${index}`}
                    style={{ padding: "6px", marginRight: "10px" }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        `student-${index}`
                      ) as HTMLInputElement;
                      addStudent(index, input.value);
                      input.value = "";
                    }}
                    style={{ padding: "6px 10px" }}
                  >
                    添加学生
                  </button>
                </div>

                {/* 学生列表 */}
                {cls.students.length > 0 && (
                  <ul style={{ marginTop: "10px" }}>
                    {cls.students.map((student, sIndex) => (
                      <li key={sIndex}>{student.name}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
