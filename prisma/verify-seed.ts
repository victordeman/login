import "dotenv/config";
import prisma from '../lib/prisma'

async function main() {
  const users = await prisma.user.findMany()
  console.log('--- Database User Verification ---')
  
  users.forEach(user => {
    console.log(`Email: ${user.email.padEnd(20)} | Role: ${user.role.padEnd(10)} | Name: ${user.name}`)
  })
  
  console.log('-----------------------------------')

  if (users.length >= 2) {
    console.log('Verification successful: At least 2 users found.')
  } else {
    console.error(`Verification failed: Expected at least 2 users, found ${users.length}`)
    process.exit(1)
  }

  const admin = users.find(u => u.role === 'ADMIN')
  const user = users.find(u => u.role === 'USER')

  if (admin && user) {
    console.log('Verification successful: Both ADMIN and USER roles are present.')
  } else {
    console.error('Verification failed: Roles missing.')
    process.exit(1)
  }
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
