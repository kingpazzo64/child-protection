"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample data for the 8-column table
const tableData = [
  {
    id: "USR001",
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
    role: "Senior Developer",
    status: "Active",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-02"
  },
  {
    id: "USR002", 
    name: "Bob Smith",
    email: "bob@example.com",
    department: "Marketing",
    role: "Marketing Manager",
    status: "Active",
    joinDate: "2023-03-22",
    lastLogin: "2024-01-01"
  },
  {
    id: "USR003",
    name: "Carol Davis",
    email: "carol@example.com", 
    department: "Sales",
    role: "Sales Representative",
    status: "Inactive",
    joinDate: "2022-11-08",
    lastLogin: "2023-12-20"
  },
  {
    id: "USR004",
    name: "David Wilson",
    email: "david@example.com",
    department: "Engineering", 
    role: "Frontend Developer",
    status: "Active",
    joinDate: "2023-06-10",
    lastLogin: "2024-01-02"
  },
  {
    id: "USR005",
    name: "Emma Brown",
    email: "emma@example.com",
    department: "HR",
    role: "HR Specialist",
    status: "Active", 
    joinDate: "2023-02-28",
    lastLogin: "2023-12-30"
  },
  {
    id: "USR006",
    name: "Frank Miller",
    email: "frank@example.com",
    department: "Finance",
    role: "Financial Analyst",
    status: "Active",
    joinDate: "2023-04-12",
    lastLogin: "2024-01-01"
  }
]

const getStatusBadgeVariant = (status: string) => {
  return status === "Active" ? "default" : "secondary"
}

export function DataTable() {
  return (
    <Card className="shadow-card border-border/50">
      <CardHeader className="bg-gradient-accent">
        <CardTitle className="text-xl font-semibold text-foreground">User Management</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage and monitor user accounts across your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground min-w-[100px]">User ID</TableHead>
                <TableHead className="font-semibold text-foreground min-w-[150px]">Name</TableHead>
                <TableHead className="font-semibold text-foreground min-w-[200px]">Email</TableHead>
                <TableHead className="font-semibold text-foreground min-w-[120px]">Department</TableHead>
                <TableHead className="font-semibold text-foreground min-w-[150px]">Role</TableHead>
                <TableHead className="font-semibold text-foreground min-w-[100px]">Status</TableHead>
                <TableHead className="font-semibold text-foreground min-w-[120px]">Join Date</TableHead>
                <TableHead className="font-semibold text-foreground min-w-[120px]">Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="hover:bg-accent/30 transition-colors border-border/50"
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {user.id}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {user.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {user.role}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.joinDate}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}