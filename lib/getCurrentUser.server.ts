// lib/getCurrentUser.server.ts
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { prisma } from "./prisma"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  // Fetch full user with district info
  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      district: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!user) return null

  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    districtId: user.districtId,
    district: user.district,
  }
}
