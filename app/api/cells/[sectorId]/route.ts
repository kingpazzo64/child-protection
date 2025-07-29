// app/api/cells/[sectorId]/route.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Context {
  params: {
    sectorId: string
  }
}

export async function GET(request: NextRequest, context: Context) {
  const { sectorId } = context.params

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
  } catch (error) {
    console.error('GET /api/cells/[sectorId] error:', error)
    return NextResponse.json({ error: 'Failed to load cells.' }, { status: 500 })
  }
}
