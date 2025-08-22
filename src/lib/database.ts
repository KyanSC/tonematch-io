import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getGuitars() {
  return await prisma.guitar.findMany({
    orderBy: { brand: 'asc' }
  })
}

export async function getAmps() {
  return await prisma.amp.findMany({
    orderBy: { brand: 'asc' }
  })
}

export async function getSongs(search?: string, filters?: { genre?: string; decade?: string }, limit?: number) {
  const where: Record<string, unknown> = {}
  
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { artist: { contains: search } }
    ]
  }
  
  if (filters?.genre) {
    where.genre = filters.genre
  }
  
  if (filters?.decade) {
    const startYear = parseInt(filters.decade)
    const endYear = startYear + 9
    where.year = { gte: startYear, lte: endYear }
  }
  
  return await prisma.song.findMany({
    where,
    include: {
      tones: true
    },
    orderBy: { title: 'asc' },
    ...(limit && { take: limit })
  })
}

export async function getSongWithTones(songId: string) {
  return await prisma.song.findUnique({
    where: { id: songId },
    include: {
      tones: true
    }
  })
}

// Note: GearMatch functionality removed as it's not part of current schema 