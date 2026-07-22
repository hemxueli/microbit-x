"use client";
import { useState } from "react";

export default function ClassesPage() {
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");

  const addClass = () => {
    if (newClass.trim() !== "") {
      setClasses([...classes, newClass]);
      setNewClass("");
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
              <li key={index} style={{ marginBottom: "10px" }}>
                {cls} 
                <button style={{ marginLeft: "10px" }}>添加学生</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
