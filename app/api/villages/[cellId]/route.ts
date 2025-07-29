// app/api/villages/[cellId]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { cellId: string } }
) {
  // Validate and parse the incoming cellId
  const rawId = params.cellId
  const cellId = Number(rawId)
  if (Number.isNaN(cellId)) {
    return NextResponse.json(
      { error: `'${rawId}' is not a valid cellId` },
      { status: 400 }
    )
  }

  try {
    const villages = await prisma.village.findMany({
      where: { cellId },
      orderBy: { name: 'asc' },
    })
    // NextResponse.json will serialize the array for us
    return NextResponse.json([...villages])
  } catch (error) {
    console.error('GET /api/villages/[cellId] error:', error)
    return NextResponse.json(
      { error: 'Failed to load villages.' },
      { status: 500 }
    )
  }
}
