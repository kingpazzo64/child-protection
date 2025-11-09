import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Verify prisma.report exists (safety check)
    if (!prisma.report) {
      console.error('Prisma client does not have report model. Please restart the dev server.')
      return NextResponse.json(
        { error: 'Database model not available. Please restart the server.' },
        { status: 500 }
      )
    }

    const reports = await prisma.report.findMany({
      include: {
        directory: {
          select: {
            id: true,
            nameOfOrganization: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ reports })
  } catch (err: any) {
    console.error('Error fetching reports:', err)
    const errorMessage = err.message || 'Failed to fetch reports'
    console.error('Error details:', {
      message: errorMessage,
      name: err.name,
      code: err.code,
      stack: err.stack,
    })
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      directoryId,
      reportType,
      description,
      reporterName,
      reporterEmail,
      reporterPhone,
    } = await req.json()

    // Validate required fields
    if (!directoryId || !reportType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: directoryId, reportType, and description are required' },
        { status: 400 }
      )
    }

    // Validate directory exists
    const directory = await prisma.directory.findUnique({
      where: { id: parseInt(directoryId) },
    })

    if (!directory) {
      return NextResponse.json(
        { error: 'Directory not found' },
        { status: 404 }
      )
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        directoryId: parseInt(directoryId),
        reportType,
        description,
        reporterName: reporterName || null,
        reporterEmail: reporterEmail || null,
        reporterPhone: reporterPhone || null,
        status: 'PENDING',
      },
      include: {
        directory: {
          select: {
            nameOfOrganization: true,
          },
        },
      },
    })

    return NextResponse.json(
      { 
        message: 'Report submitted successfully',
        report 
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Error creating report:', err)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}

