import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { sendEmail, sendInviteEmail } from '@/lib/mailer'
import { getToken } from 'next-auth/jwt'

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { name, email, phone, idNumber, role } = await req.json()

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
  }

  const activationToken = nanoid(32)

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      idNumber,
      role: role.toUpperCase(),
      activationToken,
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const link = `${baseUrl}/activate?token=${activationToken}`
  
  try {
    await sendInviteEmail(email, activationToken)
  } catch (err) {
    console.error('❌ Failed to send invite email:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
