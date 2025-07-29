// app/api/users/[id]/resend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'
import { nanoid } from 'nanoid'
import { sendInviteEmail } from '@/lib/mailer'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id:Number(id) } })

  if (!user || user.password) {
    return NextResponse.json({ error: 'User not found or already activated' }, { status: 400 })
  }

  const newToken = nanoid(32)

  await prisma.user.update({
    where: { id:Number(id) },
    data: { activationToken: newToken },
  })

  await sendInviteEmail(user.email, newToken)

  return NextResponse.json({ success: true })
}
