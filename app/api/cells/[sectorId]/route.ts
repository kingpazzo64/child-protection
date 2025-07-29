// app/api/cells/[sectorId]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, context: { params: { sectorId: string } }) {
  const sectorId = parseInt(context.params.sectorId)

  try {
    const cells = await prisma.cell.findMany({
      where: { sectorId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(cells)
  } catch (error) {
    console.error('GET /api/cells/[sectorId] error:', error)
    return NextResponse.json({ error: 'Failed to load cells.' }, { status: 500 })
  }
}
