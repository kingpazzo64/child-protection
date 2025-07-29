import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ users })
}