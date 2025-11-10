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
  // 1) Seed admin
  const adminEmail = 'admin@gmail.com'
  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } })

  if (!existingUser) {
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
    console.log('✅ Admin user already exists.')
  }

  // 2) Seed locations
  const locationPath = path.join(__dirname, 'data', 'locations.json')
  const rawLocation = fs.readFileSync(locationPath, 'utf-8')
  const locationData: LocationData = JSON.parse(rawLocation)

  for (const province of locationData.provinces) {
    for (const district of province.districts) {
      // Check if district already exists
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
        console.log(`📍 District already exists: ${district.name}`)
      }
    }
  }

  console.log('✅ Location seeding completed!')

  // 3) Seed service types
  const servicePath = path.join(__dirname, 'data', 'serviceTypes.json')
  const rawService = fs.readFileSync(servicePath, 'utf-8')
  const serviceData = JSON.parse(rawService)
  
  for (const name of serviceData) {
    // Check if service type already exists
    const existingServiceType = await prisma.serviceType.findUnique({
      where: { name },
    })

    if (!existingServiceType) {
      await prisma.serviceType.create({
        data: {
          name
        },
      })
      console.log(`📍 Created service type: ${name}`)
    } else {
      console.log(`📍 Service type already exists: ${name}`)
    }
  }

  console.log('✅ Service types seeding completed!')

}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
