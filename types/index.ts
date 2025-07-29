// types/index.ts
export type Role = 'ADMIN' | 'ENUMERATOR'

export type User = {
  id: number
  name: string
  email: string
  phone: string
  role: Role
  disabled: boolean
  emailVerified: boolean
}

export type ServiceType = {
  id: number
  name: string
}

export type Tag = {
  id: number
  name: string
}

export type Village = {
  id: number
  name: string
  cellId: number
}

export type Cell = {
  id: number
  name: string
  sectorId: number
}

export type Sector = {
  id: number
  name: string
  districtId: number
}

export type District = {
  id: number
  name: string
}

export type Directory = {
  id: number
  nameOfOrganization: string
  category: string
  email: string
  phone: string
  website?: string | null
  paid: boolean
  amount?: number | null
  estimatedAttendance: number
  createdAt: string | Date

  serviceTypeId: number
  serviceType: ServiceType

  districtId: number
  district: District

  sectorId: number
  sector: Sector

  cellId: number
  cell: Cell

  villageId: number
  village: Village

  createdById: number
  createdBy: User

  lat: number
  long: number
  otherServices?: string
}