// lib/getCurrentUser.server.ts
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { prisma } from "./prisma"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  try {
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
  } catch (error: any) {
    // Handle database connection errors gracefully
    console.error('Error fetching current user:', error)
    
    // If it's a connection error, log it but don't crash the app
    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database server')) {
      console.error('Database connection error - check your DATABASE_URL and ensure the database server is running')
      // Return null to allow the page to render (though user-specific features won't work)
      return null
    }
    
    // Re-throw other errors
    throw error
  }
}
