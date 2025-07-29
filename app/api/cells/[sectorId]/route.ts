// app/api/cells/[sectorId]/route.ts
// app/api/cells/[sectorId]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { sectorId: string } }
) {
  const sectorId = Number(params.sectorId)
  try {
    const cells = await prisma.cell.findMany({
      where: { sectorId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json([...cells])
  } catch (error) {
    console.error('GET /api/cells/[sectorId] error:', error)
    return NextResponse.json(
      { error: 'Failed to load cells.' },
      { status: 500 }
    )
  }
}
