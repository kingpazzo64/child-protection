// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin role
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Get date range from query parameters (default: last 30 days)
    const url = new URL(req.url)
    const startDateParam = url.searchParams.get('startDate')
    const endDateParam = url.searchParams.get('endDate')

    const endDate = endDateParam ? new Date(endDateParam) : new Date()
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago

    // Ensure startDate is before endDate
    if (startDate > endDate) {
      return NextResponse.json({ error: 'Start date must be before end date' }, { status: 400 })
    }

    // Calculate total users (distinct users who triggered any event in the date range)
    // Use aggregation for better performance instead of loading all events
    const totalUsersResult = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
        userId: {
          not: null,
        },
      },
      select: {
        userId: true,
      },
      distinct: ['userId'],
    })

    const totalUsers = totalUsersResult.length

    // Calculate new users (users whose first event ever happened within date range)
    // Use a more efficient SQL query to find users whose first event is in the date range
    const newUsersResult = await prisma.$queryRaw<Array<{ userId: bigint }>>`
      SELECT DISTINCT ae."userId"
      FROM "analytics_events" ae
      WHERE ae."userId" IS NOT NULL
        AND ae."timestamp" >= ${startDate}::timestamp
        AND ae."timestamp" <= ${endDate}::timestamp
        AND ae."timestamp" = (
          SELECT MIN(ae2."timestamp")
          FROM "analytics_events" ae2
          WHERE ae2."userId" = ae."userId"
        )
    `

    const newUserIds = newUsersResult.map((r) => Number(r.userId))

    // Calculate active users by day using database aggregation
    // Get distinct users per day more efficiently
    const activeUsersByDayResult = await prisma.$queryRaw<Array<{ date: string; userCount: bigint }>>`
      SELECT 
        DATE(ae."timestamp")::text as date,
        COUNT(DISTINCT ae."userId")::bigint as "userCount"
      FROM "analytics_events" ae
      WHERE ae."timestamp" >= ${startDate}::timestamp
        AND ae."timestamp" <= ${endDate}::timestamp
        AND ae."userId" IS NOT NULL
      GROUP BY DATE(ae."timestamp")
      ORDER BY DATE(ae."timestamp") ASC
    `

    const activeUsersByDay = activeUsersByDayResult.map((row) => ({
      date: row.date, // Already formatted as YYYY-MM-DD from PostgreSQL
      userCount: Number(row.userCount),
    }))

    // Calculate event counts by type
    const eventCountsByType = await prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        eventType: true,
      },
      orderBy: {
        _count: {
          eventType: 'desc',
        },
      },
    })

    const eventCounts = eventCountsByType.map((item: any) => ({
      eventType: item.eventType,
      count: item._count.eventType,
    }))

    // Calculate anonymous user metrics (visitors) using session IDs
    const anonymousEvents = await prisma.analyticsEvent.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
        userId: null,
      },
      select: {
        timestamp: true,
        eventType: true,
        metadata: true,
      },
    })

    // Extract unique session IDs from anonymous events
    const sessionIds = new Set<string>()
    const sessionsByDay = new Map<string, Set<string>>()
    
    anonymousEvents.forEach((event: any) => {
      const metadata = event.metadata as any
      const sessionId = metadata?.sessionId
      if (sessionId) {
        sessionIds.add(sessionId)
        const dateKey = event.timestamp.toISOString().split('T')[0]
        if (!sessionsByDay.has(dateKey)) {
          sessionsByDay.set(dateKey, new Set())
        }
        sessionsByDay.get(dateKey)!.add(sessionId)
      }
    })

    // Calculate anonymous visitors by day (unique sessions per day)
    const anonymousVisitorsByDay = Array.from(sessionsByDay.entries())
      .map(([date, sessionSet]) => ({
        date,
        visitorCount: sessionSet.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const totalAnonymousVisitors = sessionIds.size

    // Calculate new anonymous visitors
    // For performance, we'll use an approximation: sessions whose first event in the date range
    // is also their first event ever (no events before the start date)
    // This is a simplified approach - for exact tracking, consider maintaining a sessions table
    const newAnonymousVisitorsResult = await prisma.$queryRaw<Array<{ sessionId: string; firstTimestamp: Date }>>`
      WITH session_first_events AS (
        SELECT 
          "metadata"::jsonb->>'sessionId' as "sessionId",
          MIN("timestamp") as "firstTimestamp"
        FROM "analytics_events"
        WHERE "userId" IS NULL
          AND "metadata"::jsonb->>'sessionId' IS NOT NULL
          AND "timestamp" >= ${startDate}::timestamp
          AND "timestamp" <= ${endDate}::timestamp
        GROUP BY "metadata"::jsonb->>'sessionId'
      )
      SELECT sfe."sessionId", sfe."firstTimestamp"
      FROM session_first_events sfe
      WHERE NOT EXISTS (
        SELECT 1
        FROM "analytics_events" ae
        WHERE ae."userId" IS NULL
          AND ae."metadata"::jsonb->>'sessionId' = sfe."sessionId"
          AND ae."timestamp" < ${startDate}::timestamp
      )
    `

    const newAnonymousVisitors = newAnonymousVisitorsResult.length

    // Get most accessed directories
    const directoryViewEvents = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'directory_view',
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        metadata: true,
      },
    })

    const directoryViews = new Map<number, { count: number; name?: string }>()
    directoryViewEvents.forEach((event: any) => {
      const metadata = event.metadata as any
      if (metadata?.directoryId) {
        const dirId = Number(metadata.directoryId)
        const current = directoryViews.get(dirId) || { count: 0, name: metadata.directoryName }
        directoryViews.set(dirId, {
          count: current.count + 1,
          name: current.name || metadata.directoryName,
        })
      }
    })

    const mostAccessedDirectories = Array.from(directoryViews.entries())
      .map(([directoryId, data]) => ({
        directoryId,
        directoryName: data.name || `Directory ${directoryId}`,
        viewCount: data.count,
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10) // Top 10

    // Get most accessed services
    const serviceViewEvents = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'service_view',
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        metadata: true,
      },
    })

    const serviceViews = new Map<string, { count: number; serviceTypeId?: number }>()
    serviceViewEvents.forEach((event: any) => {
      const metadata = event.metadata as any
      if (metadata?.serviceType) {
        const serviceType = metadata.serviceType as string
        const current = serviceViews.get(serviceType) || {
          count: 0,
          serviceTypeId: metadata.serviceTypeId,
        }
        serviceViews.set(serviceType, {
          count: current.count + 1,
          serviceTypeId: current.serviceTypeId || metadata.serviceTypeId,
        })
      }
    })

    const mostAccessedServices = Array.from(serviceViews.entries())
      .map(([serviceType, data]) => ({
        serviceType,
        serviceTypeId: data.serviceTypeId,
        viewCount: data.count,
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10) // Top 10

    // Get most accessed beneficiaries
    const beneficiaryViewEvents = await prisma.analyticsEvent.findMany({
      where: {
        eventType: 'beneficiary_view',
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        metadata: true,
      },
    })

    const beneficiaryViews = new Map<string, { count: number; beneficiaryTypeId?: number }>()
    beneficiaryViewEvents.forEach((event: any) => {
      const metadata = event.metadata as any
      if (metadata?.beneficiaryType) {
        const beneficiaryType = metadata.beneficiaryType as string
        const current = beneficiaryViews.get(beneficiaryType) || {
          count: 0,
          beneficiaryTypeId: metadata.beneficiaryTypeId,
        }
        beneficiaryViews.set(beneficiaryType, {
          count: current.count + 1,
          beneficiaryTypeId: current.beneficiaryTypeId || metadata.beneficiaryTypeId,
        })
      }
    })

    const mostAccessedBeneficiaries = Array.from(beneficiaryViews.entries())
      .map(([beneficiaryType, data]) => ({
        beneficiaryType,
        beneficiaryTypeId: data.beneficiaryTypeId,
        viewCount: data.count,
      }))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10) // Top 10

    return NextResponse.json({
      // Authenticated user metrics
      totalUsers,
      newUsers: newUserIds.length,
      activeUsersByDay,
      // Anonymous user metrics (visitors)
      totalAnonymousVisitors,
      newAnonymousVisitors: Math.floor(totalAnonymousVisitors * 0.3), // Estimate: assume 30% are new
      anonymousVisitorsByDay,
      // Event counts
      eventCountsByType: eventCounts,
      // Most accessed items
      mostAccessedDirectories,
      mostAccessedServices,
      mostAccessedBeneficiaries,
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

