// app/api/villages/[cellId]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cellId: string }> }
): Promise<NextResponse> {
  const { cellId } = await params

  const parsedId = parseInt(cellId, 10)
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: 'Invalid cell ID' }, { status: 400 })
  }

  try {
    const cells = await prisma.village.findMany({
      where: { cellId: parsedId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(cells)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to load villages.' }, { status: 500 })
  }
}
