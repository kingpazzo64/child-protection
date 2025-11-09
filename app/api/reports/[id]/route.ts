import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { id } = await params
    const { status } = await req.json()

    if (!status || !['PENDING', 'REVIEWED', 'RESOLVED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be PENDING, REVIEWED, or RESOLVED' },
        { status: 400 }
      )
    }

    const report = await prisma.report.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        directory: {
          select: {
            id: true,
            nameOfOrganization: true,
          },
        },
      },
    })

    return NextResponse.json({ report })
  } catch (err) {
    console.error('Error updating report:', err)
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    )
  }
}



