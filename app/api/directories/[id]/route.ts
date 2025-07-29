// pages/api/directories/[id].ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  try {
    const {
      serviceTypeId,
      nameOfOrganization,
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
    } = await req.json()

    const [latStr, longStr] = location.split(',').map((part: string) => part.trim())
    const lat = parseFloat(latStr)
    const long = parseFloat(longStr)

    const directory = await prisma.directory.update({
      where: { id: Number(params.id) },
      data: {
        serviceTypeId: Number(serviceTypeId),
        nameOfOrganization,
        category,
        districtId: Number(districtId),
        sectorId: Number(sectorId),
        cellId: Number(cellId),
        villageId: Number(villageId),
        email,
        phone,
        website,
        paid,
        amount: Number(amount) ?? 0,
        estimatedAttendance: Number(estimatedAttendance) ?? 0,
        lat,
        long,
        otherServices,
      },
    })

    return NextResponse.json(directory)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}