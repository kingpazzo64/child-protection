// app/api/directories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  try {
    const directories = await prisma.directory.findMany({
      where: token && token.role !== 'ADMIN' ? { createdById: Number(token.id) } : {},
      include: {
        services: { include: { service: true } }, // load multiple services
        district: true,
        sector: true,
        cell: true,
        village: true,
        createdBy: true,
      }
    })

    return NextResponse.json({ directories })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch directories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const {
      serviceTypeIds, // array of numbers
      nameOfOrganization,
      category,
      districtId,
      sectorId,
      cellId,
      villageId,
      email,
      phone,
      website,
      amount,
      estimatedAttendance,
      otherServices,
      description,
      urgency,
    } = await req.json()

    const directory = await prisma.directory.create({
      data: {
        nameOfOrganization,
        category,
        email,
        phone,
        website,
        paid: Number(amount) > 0,
        amount: Number(amount) ?? 0,
        estimatedAttendance: Number(estimatedAttendance) ?? 0,
        otherServices,
        description: description ?? '',
        urgency: urgency ?? 'EXTREME_POVERTY', // default urgency
        createdById: Number(token.id),
        districtId: Number(districtId),
        sectorId: Number(sectorId),
        cellId: Number(cellId),
        villageId: Number(villageId),
        services: {
          create: serviceTypeIds?.map((id: number) => ({
            service: { connect: { id: Number(id) } },
          })) || [],
        },
      },
      include: {
        services: { include: { service: true } },
        district: true,
        sector: true,
        cell: true,
        village: true,
        createdBy: true,
      },
    })

    return NextResponse.json(directory)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create directory' }, { status: 500 })
  }
}
