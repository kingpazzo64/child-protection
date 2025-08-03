// lib/getCurrentUser.server.ts
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user) return null

  return {
    id: session?.user?.id ?? '',
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    role: session?.user?.role ?? '',
  }
}
