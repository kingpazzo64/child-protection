// app/api/sectors/[districtId]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { districtId: string } }) {
  const districtId = parseInt(params.districtId)
  try {
    const sectors = await prisma.sector.findMany({
      where: { districtId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json([ ...sectors ])
  } catch (error) {
    console.error('GET /api/sectors/[districtId] error:', error)
    return NextResponse.json({ error: 'Failed to load sectors.' }, { status: 500 })
  }
}
