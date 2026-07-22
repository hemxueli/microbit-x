"use client";
import Link from "next/link";

export default function TeacherPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome Teacher</h1>
      <p>This is the teacher dashboard.</p>

      <nav style={{ marginTop: "20px" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link href="/teacher/classes">班级管理</Link></li>
          <li><Link href="/teacher/progress">学生进度</Link></li>
          <li><Link href="/teacher/evaluation">教师评估</Link></li>
          <li><Link href="/teacher/assignments">上传功课</Link></li>
        </ul>
      </nav>
    </div>
  );
}
