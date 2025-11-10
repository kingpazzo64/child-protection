// lib/analytics-client.ts
// Client-side analytics utilities

/**
 * Get or create a session ID for anonymous user tracking
 * Stores session ID in localStorage to track anonymous users across page loads
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  const STORAGE_KEY = 'analytics_session_id'
  const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const { sessionId, timestamp } = JSON.parse(stored)
      // Check if session is still valid (within 30 minutes)
      if (Date.now() - timestamp < SESSION_DURATION) {
        return sessionId
      }
    }

    // Create new session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sessionId: newSessionId,
        timestamp: Date.now(),
      })
    )
    return newSessionId
  } catch (error) {
    // If localStorage is not available, generate a temporary session ID
    console.warn('Failed to access localStorage for analytics:', error)
    return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }
}

/**
 * Track an event from the client side
 */
export async function trackEvent(eventType: string, metadata?: Record<string, any>) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        metadata: {
          ...metadata,
          sessionId: getSessionId(), // Include session ID for anonymous tracking
        },
      }),
    })
  } catch (error) {
    // Silently fail - don't break the UI
    console.error('Failed to track event:', error)
  }
}

