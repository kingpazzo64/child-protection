// app/api/cells/[sectorId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sectorId: string }> }
): Promise<NextResponse> {
  const { sectorId } = await params

  const parsedId = parseInt(sectorId, 10)
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: 'Invalid sector ID' }, { status: 400 })
  }

  try {
    const cells = await prisma.cell.findMany({
      where: { sectorId: parsedId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(cells)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load cells.' }, { status: 500 })
  }
}
