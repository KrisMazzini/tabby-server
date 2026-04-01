import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'

import { env } from '@/env'

export const prisma = new PrismaClient({
	adapter: new PrismaPg(env.DATABASE_URL),
	log: ['warn', 'error'],
})
