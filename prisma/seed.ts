import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: adminPassword,
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: adminPassword,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      password: userPassword,
    },
    create: {
      email: 'user@example.com',
      name: 'Normal User',
      role: 'USER',
      password: userPassword,
    },
  })

  console.log('Seeding complete! You can now log in with the following test accounts:')
  console.log('-----------------------------------------------------------------')
  console.log(`- Admin: ${admin.email} (Password: admin123)`)
  console.log(`- User: ${user.email} (Password: user123)`)
  console.log('-----------------------------------------------------------------')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
