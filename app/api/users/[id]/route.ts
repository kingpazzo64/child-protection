import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

// GET /api/users/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id:Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      idNumber: true,
      role: true,
      disabled: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}

// PATCH /api/users/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()

  try {
    const updated = await prisma.user.update({
      where: { id:Number(id) },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        idNumber: body.idNumber,
        role: body.role?.toUpperCase(),
      },
    })

    return NextResponse.json({ user: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// POST /api/users/[id]
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params

  try {
    const disabledUser = await prisma.user.update({
      where: { id:Number(id) },
      data: { disabled: true },
    })

    return NextResponse.json({ user: disabledUser })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to disable user' }, { status: 500 })
  }
}
