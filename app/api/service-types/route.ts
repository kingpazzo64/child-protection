import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET() {
  const types = await prisma.serviceType.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json({ types })
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  const data = await req.json()
  try {
    const created = await prisma.serviceType.create({
      data: {
        name: data.name,
      },
    })
    return NextResponse.json(created)
  } catch (error) {
    return NextResponse.json({ error: 'Service type already exists' }, { status: 400 })
  }
}
