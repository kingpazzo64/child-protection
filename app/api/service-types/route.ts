import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const types = await prisma.serviceType.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json({ types })
}

export async function POST(req: NextRequest) {
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
