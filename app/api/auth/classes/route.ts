import { NextResponse } from 'next/server'

// 临时存储班级数据（实际项目建议用数据库）
let classes: { id: string; name: string; students: any[] }[] = []

// 获取所有班级
export async function GET() {
  return NextResponse.json(classes)
}

// 创建新班级
export async function POST(req: Request) {
  const body = await req.json()
  if (!body.name) {
    return NextResponse.json({ error: 'Class name is required' }, { status: 400 })
  }
  const newClass = { id: Date.now().toString(), name: body.name, students: [] }
  classes.push(newClass)
  return NextResponse.json(newClass, { status: 201 })
}

// 修改班级名称
export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, name } = body
  if (!id || !name) {
    return NextResponse.json({ error: 'Class id and new name are required' }, { status: 400 })
  }
  const cls = classes.find(c => c.id === id)
  if (!cls) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 })
  }
  cls.name = name
  return NextResponse.json(cls)
}

// 删除班级
export async function DELETE(req: Request) {
  const body = await req.json()
  const { id } = body
  if (!id) {
    return NextResponse.json({ error: 'Class id is required' }, { status: 400 })
  }
  classes = classes.filter(c => c.id !== id)
  return NextResponse.json({ success: true })
}
