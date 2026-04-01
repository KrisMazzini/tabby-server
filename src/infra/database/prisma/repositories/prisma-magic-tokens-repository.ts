import type { MagicTokensRepository } from '@/domain/iam/application/repositories/magic-tokens-repository'
import type { MagicToken } from '@/domain/iam/enterprise/entities/magic-token'
import { prisma } from '@/lib/prisma'

import {
	toDomainMagicToken,
	toPrismaMagicToken,
} from '../mappers/prisma-magic-token-mapper'

export class PrismaMagicTokensRepository implements MagicTokensRepository {
	async create(token: MagicToken): Promise<void> {
		const prismaToken = toPrismaMagicToken(token)

		await prisma.magicToken.create({
			data: prismaToken,
		})
	}

	async save(token: MagicToken): Promise<void> {
		const prismaToken = toPrismaMagicToken(token)

		await prisma.magicToken.update({
			where: { id: prismaToken.id },
			data: prismaToken,
		})
	}

	async findById(id: string): Promise<MagicToken | null> {
		const token = await prisma.magicToken.findUnique({
			where: { id },
		})

		return token ? toDomainMagicToken(token) : null
	}
}
