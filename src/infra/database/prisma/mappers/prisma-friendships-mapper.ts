import type { Friendship as PrismaFriendship } from 'generated/prisma/client'

import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Friendship } from '@/domain/tabs/enterprise/entities/friendship'

export function toDomainFriendship(row: PrismaFriendship): Friendship {
	return Friendship.create(
		{
			fromUserId: new UniqueEntityId(row.fromUserId),
			toUserId: new UniqueEntityId(row.toUserId),
			status: row.status,
		},
		{
			id: new UniqueEntityId(row.id),
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,
		}
	)
}

export function toPrismaFriendship(friendship: Friendship): PrismaFriendship {
	return {
		id: friendship.id.toValue(),
		fromUserId: friendship.fromUserId.toValue(),
		toUserId: friendship.toUserId.toValue(),
		status: friendship.status,
		createdAt: friendship.createdAt,
		updatedAt: friendship.updatedAt ?? null,
	}
}
