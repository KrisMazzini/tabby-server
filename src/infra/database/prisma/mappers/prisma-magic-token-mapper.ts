import type { MagicToken as PrismaMagicToken } from 'generated/prisma/client'

import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { MagicToken } from '@/domain/iam/enterprise/entities/magic-token'

export function toDomainMagicToken(row: PrismaMagicToken): MagicToken {
	return MagicToken.create(
		{
			userId: new UniqueEntityId(row.userId),
			expiresAt: row.expiresAt,
			validatedAt: row.validatedAt,
		},
		{
			id: new UniqueEntityId(row.id),
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,
		}
	)
}

export function toPrismaMagicToken(token: MagicToken): PrismaMagicToken {
	return {
		id: token.id.toString(),
		userId: token.userId.toString(),
		expiresAt: token.expiresAt,
		validatedAt: token.validatedAt,
		createdAt: token.createdAt,
		updatedAt: token.updatedAt ?? null,
	}
}
