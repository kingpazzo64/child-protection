// pages/api/directories/[id].ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  try {
    const {
      serviceTypeId,
      nameOfOrganization,
      description,
      category,
      districtId,
      sectorId,
      cellId,
      villageId,
      email,
      phone,
      website,
      paid,
      amount,
      estimatedAttendance,
      location,
      otherServices,
      urgency,
    } = await req.json()

    const [latStr, longStr] = location.split(',').map((part: string) => part.trim())
    const lat = parseFloat(latStr)
    const long = parseFloat(longStr)

    const { id } = await params

    const directory = await prisma.directory.update({
      where: { id: Number(id) },
      data: {
        serviceTypeId: Number(serviceTypeId),
        nameOfOrganization,
        description,
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
        lat,
        long,
        otherServices,
        urgency,
      },
    })

    return NextResponse.json(directory)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}