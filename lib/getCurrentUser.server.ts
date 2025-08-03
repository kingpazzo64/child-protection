// lib/getCurrentUser.server.ts
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

interface JwtPayload {
  id: string
  name: string
  email: string
  role: string
}

export async function getCurrentUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  } catch {
    return null
  }
}
