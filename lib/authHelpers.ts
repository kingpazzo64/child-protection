// lib/authHelpers.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function requireAdmin(req: any, res: any) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" })
  }
}
