import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(token.id) },
      include: {
        district: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      districtId: user.districtId,
      district: user.district,
    })
  } catch (err) {
    console.error('Error fetching user:', err)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}



