// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Building, ServerIcon } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser.server"

export default async function DashboardHome() {
  const user = await getCurrentUser()
  
  // Build directory count query based on user role
  let directoryCountWhere: any = {}
  if (user?.role === 'DISTRICT_CPO' && user.districtId) {
    directoryCountWhere = {
      locations: {
        some: {
          districtId: user.districtId,
        },
      },
    }
  } else if (user?.role === 'ENUMERATOR') {
    directoryCountWhere = {
      createdById: Number(user.id),
    }
  }

  const [totalServices, totalAdmins, totalEnumerators, totalServiceTypes] = await Promise.all([
    prisma.directory.count({ where: directoryCountWhere }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'ENUMERATOR' } }),
    prisma.serviceType.count(),
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Services Providers</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServices}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admins</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAdmins}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enumerators</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEnumerators}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Types</CardTitle>
          <ServerIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServiceTypes}</div>
        </CardContent>
      </Card>
    </div>
  )
}
