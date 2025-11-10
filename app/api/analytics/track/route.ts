// app/api/analytics/track/route.ts
// Client-side event tracking endpoint
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { logEvent } from '@/lib/analytics'

export async function POST(req: NextRequest) {
  try {
    const { eventType, metadata } = await req.json()

    if (!eventType) {
      return NextResponse.json({ error: 'eventType is required' }, { status: 400 })
    }

    // Get user if authenticated (optional - allows anonymous tracking)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token ? Number(token.id) : null

    // Log the event
    await logEvent(userId, eventType, metadata || {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

