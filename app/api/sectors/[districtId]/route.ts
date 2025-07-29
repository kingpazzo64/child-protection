// app/api/sectors/[districtId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ districtId: string }> }
): Promise<NextResponse> {
  const { districtId } = await params

  const parsedId = parseInt(districtId, 10)
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: 'Invalid district ID' }, { status: 400 })
  }

  try {
    const cells = await prisma.sector.findMany({
      where: { districtId: parsedId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(cells)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load sectors.' }, { status: 500 })
  }
}
