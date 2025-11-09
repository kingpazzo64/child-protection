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

    // Check access permissions
    if (token.role === 'DISTRICT_CPO') {
      const user = await prisma.user.findUnique({
        where: { id: Number(token.id) },
        include: { district: true },
      })
      
      if (!user || !user.districtId) {
        return NextResponse.json({ error: 'District not assigned to user' }, { status: 403 })
      }
      
      // Check if directory exists in user's district
      const existingDirectory = await prisma.directory.findFirst({
        where: {
          id: Number(id),
          locations: {
            some: {
              districtId: user.districtId,
            },
          },
        },
      })
      
      if (!existingDirectory) {
        return NextResponse.json(
          { error: `You can only update directories in ${user.district?.name} district` },
          { status: 403 }
        )
      }
      
      // Verify all new locations are in the user's district
      if (locations && locations.length > 0) {
        const invalidLocations = locations.filter((loc: any) => Number(loc.districtId) !== user.districtId)
        if (invalidLocations.length > 0) {
          return NextResponse.json(
            { error: `You can only update directories to be in ${user.district?.name} district` },
            { status: 403 }
          )
        }
      }
    } else if (token.role === 'ENUMERATOR') {
      // ENUMERATOR can only update their own directories
      const existingDirectory = await prisma.directory.findFirst({
        where: {
          id: Number(id),
          createdById: Number(token.id),
        },
      })
      
      if (!existingDirectory) {
        return NextResponse.json({ error: 'You can only update your own directories' }, { status: 403 })
      }
    }

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


export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { id } = await req.json()
    const directoryId = Number(id)

    // Check access permissions
    if (token.role === 'DISTRICT_CPO') {
      const user = await prisma.user.findUnique({
        where: { id: Number(token.id) },
        include: { district: true },
      })
      
      if (!user || !user.districtId) {
        return NextResponse.json({ error: 'District not assigned to user' }, { status: 403 })
      }
      
      // Check if directory exists in user's district
      const existingDirectory = await prisma.directory.findFirst({
        where: {
          id: directoryId,
          locations: {
            some: {
              districtId: user.districtId,
            },
          },
        },
      })
      
      if (!existingDirectory) {
        return NextResponse.json(
          { error: `You can only delete directories in ${user.district?.name} district` },
          { status: 403 }
        )
      }
    } else if (token.role === 'ENUMERATOR') {
      // ENUMERATOR can only delete their own directories
      const existingDirectory = await prisma.directory.findFirst({
        where: {
          id: directoryId,
          createdById: Number(token.id),
        },
      })
      
      if (!existingDirectory) {
        return NextResponse.json({ error: 'You can only delete your own directories' }, { status: 403 })
      }
    }

    // First delete relations manually (services, beneficiaries, locations)
    await prisma.directoryService.deleteMany({
      where: { directoryId },
    })

    await prisma.directoryBeneficiary.deleteMany({
      where: { directoryId },
    })

    await prisma.directoryLocation.deleteMany({
      where: { directoryId },
    })

    // Now delete the directory
    await prisma.directory.delete({
      where: { id: directoryId },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete directory' }, { status: 500 })
  }
}
