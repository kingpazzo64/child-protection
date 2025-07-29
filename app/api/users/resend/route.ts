import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
import { sendInviteEmail } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  const currentUser = await getUserFromRequest(req)
  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { userId } = await req.json()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.password) {
    return NextResponse.json({ error: 'User already activated or not found' }, { status: 400 })
  }

  await sendInviteEmail(user.email, user.activationToken!)

  return NextResponse.json({ message: 'Invite resent' })
}
