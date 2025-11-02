// Try to use Prisma, fall back to mock if not available
let prisma: any

try {
  const { PrismaClient } = require('@prisma/client')
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }
  prisma = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (error) {
  console.warn('⚠️  Prisma Client not available, using mock database for demo')
  const { prisma: mockPrisma } = require('./prisma-mock')
  prisma = mockPrisma
}

export { prisma }
