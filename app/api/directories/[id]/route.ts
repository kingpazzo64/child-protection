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
      paid, // <-- get from frontend
    } = await req.json()

    const { id } = await params

    // Update directory basic fields
    const updatedDirectory = await prisma.directory.update({
      where: { id: Number(id) },
      data: {
        nameOfOrganization,
        category,
        email,
        phone,
        website,
        paid: Boolean(paid), // <-- use actual user selection
        otherServices,

        // Reset services
        services: {
          deleteMany: {},
          create: serviceTypeIds?.map((sid: number) => ({
            service: { connect: { id: Number(sid) } },
          })) || [],
        },

        // Reset beneficiaries
        beneficiaries: {
          deleteMany: {},
          create: beneficiaryTypeIds?.map((bid: number) => ({
            beneficiary: { connect: { id: Number(bid) } },
          })) || [],
        },

        // Reset locations
        locations: {
          deleteMany: {},
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

    return NextResponse.json(updatedDirectory)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update directory' }, { status: 500 })
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
