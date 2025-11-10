import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

// Create Prisma client
const prisma = new PrismaClient()

// JSON interfaces
interface Village { name: string }
interface Cell { name: string; villages: Village[] }
interface Sector { name: string; cells: Cell[] }
interface District { name: string; sectors: Sector[] }
interface Province { name: string; districts: District[] }
interface LocationData { provinces: Province[] }
interface Service { name: string }

async function main() {
  console.log('🌱 Starting seed...')

  // 1) Seed admin (idempotent - only create if doesn't exist)
  const adminEmail = 'admin@gmail.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin@123', 10)
    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: adminEmail,
        phone: '0788123123',
        idNumber: '1234567890123456',
        role: 'ADMIN',
        password: hashedPassword,
        emailVerified: true,
      },
    })
    console.log(`✅ Admin user created: ${adminEmail} / admin@123`)
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`)
  }

  // 2) Seed locations
  const locationPath = path.join(__dirname, 'data', 'locations.json')
  const rawLocation = fs.readFileSync(locationPath, 'utf-8')
  const locationData: LocationData = JSON.parse(rawLocation)

  for (const province of locationData.provinces) {
    for (const district of province.districts) {
      // Check if district already exists (idempotent)
      const existingDistrict = await prisma.district.findUnique({
        where: { name: district.name },
      })
      
      if (!existingDistrict) {
        await prisma.district.create({
          data: {
            name: district.name,
            sectors: {
              create: district.sectors.map((sector) => ({
                name: sector.name,
                cells: {
                  create: sector.cells.map((cell) => ({
                    name: cell.name,
                    villages: {
                      create: cell.villages.map((village) => ({
                        name: village.name,
                      })),
                    },
                  })),
                },
              })),
            },
          },
        })
        console.log(`📍 Created district: ${district.name}`)
      } else {
        console.log(`ℹ️  District already exists: ${district.name}`)
      }
    }
  }

  console.log('✅ Location seeding completed!')

  // 3) Seed service types (idempotent - only create if doesn't exist)
  const servicePath = path.join(__dirname, 'data', 'serviceTypes.json')
  const rawService = fs.readFileSync(servicePath, 'utf-8')
  const serviceData = JSON.parse(rawService)
  
  for (const name of serviceData) {
    const existingService = await prisma.serviceType.findUnique({
      where: { name },
    })
    
    if (!existingService) {
      await prisma.serviceType.create({
        data: {
          name
        },
      })
      console.log(`📍 Created service type: ${name}`)
    } else {
      console.log(`ℹ️  Service type already exists: ${name}`)
    }
  }

  console.log('✅ Service types seeding completed!')

  // 4) Seed beneficiary types (idempotent - only create if doesn't exist)
  const beneficiaryPath = path.join(__dirname, 'data', 'beneficiaryTypes.json')
  const rawBeneficiary = fs.readFileSync(beneficiaryPath, 'utf-8')
  const beneficiaryData = JSON.parse(rawBeneficiary)
  
  for (const name of beneficiaryData) {
    const existingBeneficiary = await prisma.beneficiaryType.findUnique({
      where: { name },
    })
    
    if (!existingBeneficiary) {
      await prisma.beneficiaryType.create({
        data: {
          name
        },
      })
      console.log(`📍 Created beneficiary type: ${name}`)
    } else {
      console.log(`ℹ️  Beneficiary type already exists: ${name}`)
    }
  }

  console.log('✅ Beneficiary types seeding completed!')
  console.log('🎉 All seeding completed successfully!')

}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
