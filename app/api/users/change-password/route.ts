import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { current, newPassword } = await req.json()

  const existing = await prisma.user.findUnique({ where: { id: Number(user.id) } })
  const valid = await bcrypt.compare(current, existing?.password || '')
  if (!valid) return NextResponse.json({ error: 'Current password incorrect' }, { status: 400 })

  const hashed = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: Number(user.id) },
    data: { password: hashed },
  })

  return NextResponse.json({ success: true })
}
