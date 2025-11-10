# Analytics Implementation Documentation

## Overview
The analytics system tracks user interactions and events to provide insights into app usage.

## Tracked Events

### 1. Login Events (`login`)
- **Who**: All authenticated users (ADMIN, ENUMERATOR, DISTRICT_CPO)
- **When**: Every time a user successfully logs in
- **Tracking Location**: `lib/auth.server.ts` - NextAuth JWT callback
- **User ID**: Always present (required for login)

### 2. Directory Creation (`directory_created`)
- **Who**: All authenticated users who create directories
- **When**: Every time a directory is created via POST `/api/directories`
- **Tracking Location**: `app/api/directories/route.ts`
- **User ID**: Always present (requires authentication)
- **Metadata**: Includes directory ID, category, service count, beneficiary count, location count

### 3. Directory Search (`directory_search`)
- **Who**: 
  - **Authenticated users**: When logged in and searching on homepage
  - **Anonymous users**: When not logged in and searching on homepage
- **When**: When user applies filters on the homepage (district, service type, beneficiary type, provider name)
- **Tracking Location**: `app/page.tsx` - client-side tracking
- **User ID**: Present if authenticated, `null` if anonymous
- **Metadata**: Includes search parameters (district, serviceType, beneficiaryType, providerName)

## Analytics Dashboard Metrics

### Total Users
- **Definition**: Distinct authenticated users who triggered any event in the date range
- **Calculation**: Counts unique `userId` values (excludes `null` values)
- **Includes**: Only authenticated users
- **Excludes**: Anonymous users

### New Users
- **Definition**: Authenticated users whose first event ever happened within the date range
- **Calculation**: Finds users whose earliest event timestamp falls within the date range
- **Includes**: Only authenticated users
- **Excludes**: Anonymous users

### Active Users by Day
- **Definition**: Number of distinct authenticated users per day
- **Calculation**: Counts unique `userId` values per day (excludes `null` values)
- **Includes**: Only authenticated users
- **Excludes**: Anonymous users

### Event Counts by Type
- **Definition**: Total count of events by event type
- **Calculation**: Counts all events regardless of user authentication status
- **Includes**: All events (authenticated and anonymous)
- **Shows**: Total event volume

## Database Schema

```prisma
model AnalyticsEvent {
  id        String   @id @default(uuid())
  userId    Int?     // null for anonymous users
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  eventType String
  metadata  Json?
  timestamp DateTime @default(now())

  @@index([timestamp])
  @@index([eventType])
  @@index([userId])
  @@map("analytics_events")
}
```

## Current Behavior Summary

| Event Type | Authenticated Users | Anonymous Users | User Metrics |
|------------|---------------------|-----------------|--------------|
| Login | ✅ Tracked (with userId) | ❌ Not applicable | ✅ Counted |
| Directory Creation | ✅ Tracked (with userId) | ❌ Not applicable | ✅ Counted |
| Directory Search | ✅ Tracked (with userId) | ✅ Tracked (userId = null) | ❌ Not counted |

## Options for Modification

### Option 1: Track Only Authenticated Users
- Remove anonymous tracking from homepage search
- All events will have `userId`
- User metrics will be more accurate
- **Trade-off**: Lose visibility into anonymous user behavior

### Option 2: Enhanced Anonymous Tracking
- Add separate metrics for anonymous users
- Track anonymous user sessions
- Show both authenticated and anonymous metrics
- **Trade-off**: More complex analytics dashboard

### Option 3: Current Implementation (Recommended)
- Track all events (authenticated + anonymous)
- User metrics show only authenticated users
- Event counts show total activity
- **Benefit**: Balance between privacy and insights

## Privacy Considerations

- **Anonymous users**: No personal information is tracked (only event type and metadata)
- **Authenticated users**: User ID is tracked but can be linked to user profile
- **Metadata**: Contains search parameters but no personally identifiable information for anonymous users
- **GDPR Compliance**: Consider adding user consent for analytics tracking

## Performance Considerations

- Events are logged asynchronously (won't block user actions)
- Database indexes on `timestamp`, `eventType`, and `userId` for fast queries
- For large datasets, consider nightly aggregation jobs
- Current implementation handles moderate traffic efficiently

## Future Enhancements

1. **Session Tracking**: Track user sessions for better analytics
2. **Page Views**: Track which pages users visit
3. **Time on Page**: Track how long users spend on pages
4. **Export Functionality**: Allow admins to export analytics data
5. **Custom Date Ranges**: Allow admins to select custom date ranges
6. **Real-time Analytics**: Show real-time user activity
7. **Anonymous User Segmentation**: Group anonymous users by behavior patterns

