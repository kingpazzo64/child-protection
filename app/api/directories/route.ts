// pages/api/directories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  try {
    const directories = await prisma.directory.findMany({
      where: token && token.role !== 'ADMIN' ? { createdById: Number(token.id) } : {},
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
        createdBy: true,
      },
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
      serviceTypeIds,
      beneficiaryTypeIds,
      locations,
      nameOfOrganization,
      category,
      email,
      phone,
      website,
      otherServices,
      description,
      paid, // <-- front-end radio button
    } = await req.json()

    const directory = await prisma.directory.create({
      data: {
        nameOfOrganization,
        category,
        email,
        phone,
        website,
        paid: Boolean(paid), // save correctly
        otherServices,
        createdById: Number(token.id),

        // Services
        services: {
          create: serviceTypeIds?.map((sid: number) => ({
            service: { connect: { id: Number(sid) } },
          })) || [],
        },

        // Beneficiaries
        beneficiaries: {
          create: beneficiaryTypeIds?.map((bid: number) => ({
            beneficiary: { connect: { id: Number(bid) } },
          })) || [],
        },

        // Locations
        locations: {
          create: locations?.map((loc: any) => ({
            district: { connect: { id: Number(loc.districtId) } },
            sector: { connect: { id: Number(loc.sectorId) } },
            cell: { connect: { id: Number(loc.cellId) } },
            village: { connect: { id: Number(loc.villageId) } },
          })) || [],
        },
      },
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
        createdBy: true,
      },
    })

    return NextResponse.json(directory)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create directory' }, { status: 500 })
  }
}
