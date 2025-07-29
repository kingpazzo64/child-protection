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
  const filePath = path.join(__dirname, 'data', 'locations.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  const locationData: LocationData = JSON.parse(raw)

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
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
