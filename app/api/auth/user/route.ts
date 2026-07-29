import { NextResponse } from 'next/server'
import { db } from '@/lib/db'          // 你的 drizzle db 实例
import { user } from '@/lib/db/schema'
    // 引入 user 表
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'User id required' }, { status: 400 })
  }

  const result = await db.select().from(user).where(eq(user.id, id))
  return NextResponse.json(result[0] ?? null)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  if (!body.id) {
    return NextResponse.json({ error: 'User id required' }, { status: 400 })
  }

  await db.update(user)
    .set({
      name: body.name,
      image: body.image,
    })
    .where(eq(user.id, body.id))

  return NextResponse.json({ success: true })
}
