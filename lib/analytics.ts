// lib/analytics.ts
import { prisma } from './prisma'

/**
 * Log an analytics event
 * @param userId - Optional user ID (null for anonymous users)
 * @param eventType - Type of event (e.g., 'login', 'directory_search', 'directory_created')
 * @param metadata - Optional metadata object to store additional event data
 */
export async function logEvent(
  userId: number | null | undefined,
  eventType: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const data: any = {
      userId: userId ?? null,
      eventType,
      timestamp: new Date(),
    }
    
    // Only include metadata if it exists (Prisma Json fields should use undefined, not null)
    if (metadata) {
      data.metadata = metadata
    }
    
    await prisma.analyticsEvent.create({ data })
  } catch (error) {
    // Log error but don't throw - analytics shouldn't break the app
    console.error('Failed to log analytics event:', error)
  }
}

/**
 * Track login event
 */
export async function trackLogin(userId: number): Promise<void> {
  await logEvent(userId, 'login', {
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track directory search event
 */
export async function trackDirectorySearch(
  userId: number | null,
  searchParams: {
    district?: string
    serviceType?: string
    beneficiaryType?: string
    providerName?: string
  }
): Promise<void> {
  await logEvent(userId || null, 'directory_search', {
    ...searchParams,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track directory creation event
 */
export async function trackDirectoryCreated(
  userId: number,
  directoryId: number,
  metadata?: Record<string, any>
): Promise<void> {
  await logEvent(userId, 'directory_created', {
    directoryId,
    ...metadata,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track directory view event
 */
export async function trackDirectoryView(
  userId: number | null,
  directoryId: number,
  directoryName?: string
): Promise<void> {
  await logEvent(userId || null, 'directory_view', {
    directoryId,
    directoryName,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track service type view event
 */
export async function trackServiceView(
  userId: number | null,
  serviceType: string,
  serviceTypeId?: number
): Promise<void> {
  await logEvent(userId || null, 'service_view', {
    serviceType,
    serviceTypeId,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track beneficiary type view event
 */
export async function trackBeneficiaryView(
  userId: number | null,
  beneficiaryType: string,
  beneficiaryTypeId?: number
): Promise<void> {
  await logEvent(userId || null, 'beneficiary_view', {
    beneficiaryType,
    beneficiaryTypeId,
    timestamp: new Date().toISOString(),
  })
}

