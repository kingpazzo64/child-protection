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

// ✅ New BeneficiaryType
export type BeneficiaryType = {
  id: number
  name: string
  description?: string | null
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

export type DirectoryService = {
  id: number
  directoryId: number
  serviceId: number
  service: ServiceType
}

export type DirectoryBeneficiary = {
  id: number
  directoryId: number
  beneficiaryId: number
  beneficiary: BeneficiaryType
}

export type DirectoryLocation = {
  id: number
  directoryId: number
  districtId: number
  district: District
  sectorId: number
  sector: Sector
  cellId: number
  cell: Cell
  villageId: number
  village: Village
}

export type Directory = {
  id: number
  nameOfOrganization: string
  category: string
  email: string
  phone: string
  website?: string | null
  paid: boolean
  createdAt: string | Date

  services: DirectoryService[]
  beneficiaries: DirectoryBeneficiary[]
  locations: DirectoryLocation[]

  createdById: number
  createdBy: User

  otherServices?: string
}
