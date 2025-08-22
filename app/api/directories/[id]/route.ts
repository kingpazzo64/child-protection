// pages/api/directories/[id].ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const {
      serviceTypeIds, // array of service IDs
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

    const { id } = await params

    // update directory and reset service relations
    const directory = await prisma.directory.update({
      where: { id: Number(id) },
      data: {
        nameOfOrganization,
        category,
        districtId: Number(districtId),
        sectorId: Number(sectorId),
        cellId: Number(cellId),
        villageId: Number(villageId),
        email,
        phone,
        website,
        paid: Number(amount) > 0,
        amount: Number(amount) ?? 0,
        estimatedAttendance: Number(estimatedAttendance) ?? 0,
        otherServices,
        description: description ?? '',
        urgency: urgency ?? 'EXTREME_POVERTY',
        services: {
          deleteMany: {}, // remove all old service links
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
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { id } = await params

  try {
    await prisma.directory.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete directory' }, { status: 500 })
  }
}
