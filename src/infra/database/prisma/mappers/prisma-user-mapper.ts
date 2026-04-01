import type { User as PrismaUser } from 'generated/prisma/client'

import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { User } from '@/domain/iam/enterprise/entities/user'

export function toDomainUser(row: PrismaUser): User {
	return User.create(
		{
			name: row.name,
			email: row.email,
			dateOfBirth: row.dateOfBirth,
		},
		{
			id: new UniqueEntityId(row.id),
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,
		}
	)
}

export function toPrismaUser(user: User): PrismaUser {
	return {
		id: user.id.toString(),
		name: user.name,
		email: user.email,
		dateOfBirth: user.dateOfBirth,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt ?? null,
	}
}
