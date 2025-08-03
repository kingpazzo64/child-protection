 //app/api/directories/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  try {
    if (!token || token.role === 'ADMIN') {
      const directories = await prisma.directory.findMany({ 
        include: {
          serviceType: true,
          district: true,
          sector: true,
          cell: true,
          village: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'asc' } 
      })
      return NextResponse.json({ directories })
    }
    else{
      const directories = await prisma.directory.findMany({ 
        where: {createdById: Number(token.id)},
        include: {
          serviceType: true,
          district: true,
          sector: true,
          cell: true,
          village: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'asc' } 
      })
      return NextResponse.json({ directories })
    }
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
      location, // expected format: "lat,long"
      otherServices,
      urgency,
    } = await req.json()

    const [latStr, longStr] = location.split(',').map((part: string) => part.trim())
    const lat = parseFloat(latStr)
    const long = parseFloat(longStr)

    const directory = await prisma.directory.create({
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
        createdById: Number(token.id),
      },
    })

    return NextResponse.json(directory)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}