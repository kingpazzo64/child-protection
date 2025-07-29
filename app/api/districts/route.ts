// app/api/districts/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      include: {
        sectors: true,
        directories: true,
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json([ ...districts ])
  } catch (error) {
    console.error('GET /api/districts error:', error)
    return NextResponse.json({ error: 'Failed to load districts.' }, { status: 500 })
  }
}
