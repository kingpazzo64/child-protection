'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, UserPlus, Activity, TrendingUp } from 'lucide-react'

interface AnalyticsData {
  // Authenticated user metrics
  totalUsers: number
  newUsers: number
  activeUsersByDay: Array<{ date: string; userCount: number }>
  // Anonymous user metrics (visitors)
  totalAnonymousVisitors: number
  newAnonymousVisitors: number
  anonymousVisitorsByDay: Array<{ date: string; visitorCount: number }>
  // Event counts
  eventCountsByType: Array<{ eventType: string; count: number }>
  // Most accessed items
  mostAccessedDirectories: Array<{
    directoryId: number
    directoryName: string
    viewCount: number
  }>
  mostAccessedServices: Array<{
    serviceType: string
    serviceTypeId?: number
    viewCount: number
  }>
  mostAccessedBeneficiaries: Array<{
    beneficiaryType: string
    beneficiaryTypeId?: number
    viewCount: number
  }>
  dateRange: {
    startDate: string
    endDate: string
  }
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Set default date range (last 30 days)
  useEffect(() => {
    const end = new Date()
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
    setEndDate(end.toISOString().split('T')[0])
    setStartDate(start.toISOString().split('T')[0])
  }, [])

  const fetchAnalytics = async () => {
    if (!startDate || !endDate) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      })

      const res = await fetch(`/api/admin/analytics?${params}`)
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        if (res.status === 403) {
          toast.error('You do not have permission to view analytics')
          setAnalyticsData(null)
          router.push('/dashboard')
          return
        }
        if (res.status === 401) {
          toast.error('Please log in to view analytics')
          setAnalyticsData(null)
          router.push('/login')
          return
        }
        throw new Error(errorData.error || 'Failed to fetch analytics')
      }

      const data = await res.json()
      setAnalyticsData(data)
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      toast.error(error.message || 'Failed to load analytics data')
      setAnalyticsData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalytics()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  const handleDateChange = () => {
    if (startDate && endDate) {
      fetchAnalytics()
    }
  }

  const totalEvents = analyticsData?.eventCountsByType.reduce((sum, item) => sum + item.count, 0) || 0

  // Format event type names for display
  const formatEventType = (eventType: string) => {
    return eventType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track user activity and app usage over time
          </p>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
          <CardDescription>Select a date range to view analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <Button onClick={handleDateChange}>Apply</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      ) : analyticsData ? (
        <>
          {/* Summary Cards - Authenticated Users */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Authenticated Users</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      Distinct users with activity
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Users</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.newUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      First-time users in period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalEvents}</div>
                    <p className="text-xs text-muted-foreground">
                      All events in date range
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Daily Users</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.activeUsersByDay.length > 0
                        ? Math.round(
                            analyticsData.activeUsersByDay.reduce((sum, day) => sum + day.userCount, 0) /
                              analyticsData.activeUsersByDay.length
                          )
                        : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average active users per day
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Anonymous Visitors */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Anonymous Visitors</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.totalAnonymousVisitors}</div>
                    <p className="text-xs text-muted-foreground">
                      Unique anonymous visitors
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Visitors</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.newAnonymousVisitors}</div>
                    <p className="text-xs text-muted-foreground">
                      First-time visitors in period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Daily Visitors</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData.anonymousVisitorsByDay.length > 0
                        ? Math.round(
                            analyticsData.anonymousVisitorsByDay.reduce((sum, day) => sum + day.visitorCount, 0) /
                              analyticsData.anonymousVisitorsByDay.length
                          )
                        : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average visitors per day
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Combined Users and Visitors Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Users & Visitors Over Time</CardTitle>
              <CardDescription>Authenticated users and anonymous visitors per day</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.activeUsersByDay.length > 0 || analyticsData.anonymousVisitorsByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={(() => {
                      // Combine authenticated users and anonymous visitors by date
                      const combinedData = new Map<string, { date: string; users: number; visitors: number }>()
                      
                      analyticsData.activeUsersByDay.forEach((day) => {
                        combinedData.set(day.date, { date: day.date, users: day.userCount, visitors: 0 })
                      })
                      
                      analyticsData.anonymousVisitorsByDay.forEach((day) => {
                        const existing = combinedData.get(day.date)
                        if (existing) {
                          existing.visitors = day.visitorCount
                        } else {
                          combinedData.set(day.date, { date: day.date, users: 0, visitors: day.visitorCount })
                        }
                      })
                      
                      return Array.from(combinedData.values()).sort((a, b) => a.date.localeCompare(b.date))
                    })()}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => `Date: ${formatDate(label)}`}
                      formatter={(value: number, name: string) => [
                        value,
                        name === 'users' ? 'Authenticated Users' : 'Anonymous Visitors',
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Authenticated Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="visitors"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      name="Anonymous Visitors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No data available for the selected date range
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Counts by Type Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Events by Type</CardTitle>
              <CardDescription>Number of events for each event type</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.eventCountsByType.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.eventCountsByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="eventType"
                      tickFormatter={formatEventType}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(label) => `Event Type: ${formatEventType(label)}`}
                      formatter={(value: number) => [value, 'Count']}
                    />
                    <Legend />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Event Count" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No events found for the selected date range
                </div>
              )}
            </CardContent>
          </Card>

          {/* Most Accessed Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Most Accessed Directories */}
            <Card>
              <CardHeader>
                <CardTitle>Most Accessed Directories</CardTitle>
                <CardDescription>Top 10 directories by views</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.mostAccessedDirectories.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {analyticsData.mostAccessedDirectories.slice(0, 10).map((dir, index) => (
                      <div key={dir.directoryId} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{dir.directoryName}</p>
                          <p className="text-xs text-muted-foreground">{dir.viewCount} views</p>
                        </div>
                        <div className="ml-2 text-lg font-bold text-primary">#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No directory views yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Most Accessed Services */}
            <Card>
              <CardHeader>
                <CardTitle>Most Accessed Services</CardTitle>
                <CardDescription>Top 10 service types by views</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.mostAccessedServices.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {analyticsData.mostAccessedServices.slice(0, 10).map((service, index) => (
                      <div key={service.serviceType} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{service.serviceType}</p>
                          <p className="text-xs text-muted-foreground">{service.viewCount} views</p>
                        </div>
                        <div className="ml-2 text-lg font-bold text-primary">#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No service views yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Most Accessed Beneficiaries */}
            <Card>
              <CardHeader>
                <CardTitle>Most Accessed Beneficiaries</CardTitle>
                <CardDescription>Top 10 beneficiary types by views</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.mostAccessedBeneficiaries.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {analyticsData.mostAccessedBeneficiaries.slice(0, 10).map((beneficiary, index) => (
                      <div key={beneficiary.beneficiaryType} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{beneficiary.beneficiaryType}</p>
                          <p className="text-xs text-muted-foreground">{beneficiary.viewCount} views</p>
                        </div>
                        <div className="ml-2 text-lg font-bold text-primary">#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No beneficiary views yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      )}
    </div>
  )
}

