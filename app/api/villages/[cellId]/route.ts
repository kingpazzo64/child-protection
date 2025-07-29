// app/api/villages/[cellId]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { cellId: string } }) {
  const cellId = parseInt(params.cellId)
  try {
    const villages = await prisma.village.findMany({
      where: { cellId },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json([ ...villages ])
  } catch (error) {
    console.error('GET /api/villages/[cellId] error:', error)
    return NextResponse.json({ error: 'Failed to load villages.' }, { status: 500 })
  }
}
