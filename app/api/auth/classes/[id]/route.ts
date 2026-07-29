import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function getDb() {
  return open({
    filename: "./lib/db/data.sqlite",
    driver: sqlite3.Database
  });
}

// 删除班级
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    await db.run("DELETE FROM classes WHERE id = ?", [params.id]);
    await db.run("DELETE FROM teachers WHERE class_id = ?", [params.id]); // 同时删除关联老师
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "删除失败" }, { status: 500 });
  }
}

// 保存老师信息（名字 + 头像）
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, avatar } = body;

  try {
    const db = await getDb();
    await db.run(
      "INSERT INTO teachers (id, name, avatar, class_id) VALUES (?, ?, ?, ?)",
      [Date.now().toString(), name, avatar, params.id]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "保存失败" }, { status: 500 });
  }
}
