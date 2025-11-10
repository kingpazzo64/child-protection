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
  console.log('🗑️  Starting database truncation...')
  
  // Truncate all tables and reset sequences
  // Using RESTART IDENTITY to reset auto-increment sequences to start from 1
  // Using CASCADE to automatically handle dependent records and foreign keys
  try {
    // Truncate all tables in one command with RESTART IDENTITY and CASCADE
    // RESTART IDENTITY is crucial - it resets all auto-increment sequences
    // This prevents "Unique constraint failed on id" errors when reseeding
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "analytics_events",
        "reports",
        "DirectoryBeneficiary",
        "DirectoryService",
        "DirectoryLocation",
        "Directory",
        "users",
        "Village",
        "Cell",
        "Sector",
        "District",
        "BeneficiaryType",
        "ServiceType"
      RESTART IDENTITY CASCADE
    `)
    
    console.log('✅ All tables truncated and sequences reset successfully!')
  } catch (error: any) {
    console.error('❌ Error truncating tables:', error)
    console.error('Error details:', error.message)
    throw error
  }

  console.log('🌱 Starting fresh seed...')

  // 1) Seed admin
  const adminEmail = 'admin@gmail.com'
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

  // 2) Seed locations
  const locationPath = path.join(__dirname, 'data', 'locations.json')
  const rawLocation = fs.readFileSync(locationPath, 'utf-8')
  const locationData: LocationData = JSON.parse(rawLocation)

  for (const province of locationData.provinces) {
    for (const district of province.districts) {
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
    }
  }

  console.log('✅ Location seeding completed!')

  // 3) Seed service types
  const servicePath = path.join(__dirname, 'data', 'serviceTypes.json')
  const rawService = fs.readFileSync(servicePath, 'utf-8')
  const serviceData = JSON.parse(rawService)
  
  for (const name of serviceData) {
    await prisma.serviceType.create({
      data: {
        name
      },
    })
    console.log(`📍 Created service type: ${name}`)
  }

  console.log('✅ Service types seeding completed!')

  // 4) Seed beneficiary types
  const beneficiaryPath = path.join(__dirname, 'data', 'beneficiaryTypes.json')
  const rawBeneficiary = fs.readFileSync(beneficiaryPath, 'utf-8')
  const beneficiaryData = JSON.parse(rawBeneficiary)
  
  for (const name of beneficiaryData) {
    await prisma.beneficiaryType.create({
      data: {
        name
      },
    })
    console.log(`📍 Created beneficiary type: ${name}`)
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
