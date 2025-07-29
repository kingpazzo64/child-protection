// app/api/sectors/[districtId]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { districtId: string } }
) {
  // Validate and parse the incoming districtId
  const rawId = params.districtId
  const districtId = Number(rawId)
  if (Number.isNaN(districtId)) {
    return NextResponse.json(
      { error: `'${rawId}' is not a valid districtId` },
      { status: 400 }
    )
  }

  try {
    const sectors = await prisma.sector.findMany({
      where: { districtId },
      orderBy: { name: 'asc' },
    })

    // No need for array spread—NextResponse.json will serialize the array
    return NextResponse.json([...sectors])
  } catch (error) {
    console.error('GET /api/sectors/[districtId] error:', error)
    return NextResponse.json(
      { error: 'Failed to load sectors.' },
      { status: 500 }
    )
  }
}
