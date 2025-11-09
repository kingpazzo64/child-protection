'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flag, Mail, Phone, Calendar, Building, User, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Report {
  id: number
  directoryId: number
  reportType: string
  description: string
  reporterName: string | null
  reporterEmail: string | null
  reporterPhone: string | null
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED'
  createdAt: string
  updatedAt: string
  directory: {
    id: number
    nameOfOrganization: string
    email: string
    phone: string
  }
}

const reportTypeLabels: Record<string, string> = {
  NON_FUNCTIONAL: 'Non-functional Service Provider',
  INACTIVE_SERVICE: 'Inactive Service',
  INCORRECT_INFO: 'Incorrect Information',
  OTHER: 'Other',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
  REVIEWED: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  RESOLVED: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reports')
      
      let errorMessage = 'Failed to fetch reports'
      try {
        const data = await res.json()
        
        if (!res.ok) {
          errorMessage = data.error || `Error ${res.status}: ${res.statusText}`
          throw new Error(errorMessage)
        }
        
        setReports(data.reports || [])
      } catch (parseError: any) {
        // If JSON parsing fails, check the status
        if (!res.ok) {
          errorMessage = `Error ${res.status}: ${res.statusText}`
          if (res.status === 401) {
            errorMessage = 'Not authenticated. Please log in.'
          } else if (res.status === 403) {
            errorMessage = 'Admin access required. You do not have permission to view reports.'
          }
          throw new Error(errorMessage)
        }
        throw parseError
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load reports'
      toast.error(errorMessage)
      console.error('Error fetching reports:', err)
      // Set empty array on error so UI doesn't break
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (reportId: number, newStatus: string) => {
    setUpdatingStatus(reportId)
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      toast.success('Report status updated successfully')
      fetchReports()
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: newStatus as any })
      }
    } catch (err) {
      toast.error('Failed to update report status')
      console.error(err)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const filteredReports = reports.filter(report => 
    statusFilter === 'ALL' || report.status === statusFilter
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading reports...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Manage and review reported service provider issues
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Flag className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">No reports found</p>
              <p className="text-muted-foreground text-sm mt-1">
                {statusFilter !== 'ALL' 
                  ? `No reports with status "${statusFilter}"` 
                  : 'No reports have been submitted yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">
                        {report.directory.nameOfOrganization}
                      </CardTitle>
                      <Badge className={statusColors[report.status]}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline">
                        {reportTypeLabels[report.reportType] || report.reportType}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(report.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={report.status}
                      onValueChange={(value) => handleStatusUpdate(report.id, value)}
                      disabled={updatingStatus === report.id}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REVIEWED">Reviewed</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedReport(report)
                        setIsDialogOpen(true)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground line-clamp-2">
                  {report.description}
                </p>
                {report.reporterName && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Reported by: {report.reporterName}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Report Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Report Details
                </DialogTitle>
                <DialogDescription>
                  View complete information about this report
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Service Provider Info */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Service Provider
                  </h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="font-medium">{selectedReport.directory.nameOfOrganization}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {selectedReport.directory.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedReport.directory.email}
                        </span>
                      )}
                      {selectedReport.directory.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedReport.directory.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Report Type & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Report Type</h3>
                    <Badge variant="outline" className="text-sm">
                      {reportTypeLabels[selectedReport.reportType] || selectedReport.reportType}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Status</h3>
                    <Badge className={statusColors[selectedReport.status]}>
                      {selectedReport.status}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Description
                  </h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                </div>

                {/* Reporter Info */}
                {(selectedReport.reporterName || selectedReport.reporterEmail || selectedReport.reporterPhone) && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Reporter Information
                    </h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                      {selectedReport.reporterName && (
                        <p><span className="font-medium">Name:</span> {selectedReport.reporterName}</p>
                      )}
                      {selectedReport.reporterEmail && (
                        <p className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="font-medium">Email:</span> {selectedReport.reporterEmail}
                        </p>
                      )}
                      {selectedReport.reporterPhone && (
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span className="font-medium">Phone:</span> {selectedReport.reporterPhone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">{formatDate(selectedReport.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDate(selectedReport.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Select
                  value={selectedReport.status}
                  onValueChange={(value) => handleStatusUpdate(selectedReport.id, value)}
                  disabled={updatingStatus === selectedReport.id}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REVIEWED">Reviewed</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

