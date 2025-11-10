// app/api/public/directories/route.ts
// Public endpoint that always returns all directories (no authentication required)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Always return all directories for public access (homepage)
    const directories = await prisma.directory.findMany({
      where: {}, // No filtering - return all directories
      include: {
        services: { include: { service: true } },
        beneficiaries: { include: { beneficiary: true } },
        locations: {
          include: {
            district: true,
            sector: true,
            cell: true,
            village: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })


    return NextResponse.json({ directories })
  } catch (err) {
    console.error('Error fetching public directories:', err)
    return NextResponse.json({ error: 'Failed to fetch directories' }, { status: 500 })
  }
}



