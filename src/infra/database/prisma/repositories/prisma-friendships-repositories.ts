import type { Prisma } from 'generated/prisma/client'

import type {
	PaginatedResult,
	PaginationParams,
} from '@/core/pagination/pagination'
import type {
	FriendshipsListFilters,
	FriendshipsRepository,
} from '@/domain/tabs/application/repositories/friendships-repository'
import type { Friendship } from '@/domain/tabs/enterprise/entities/friendship'
import { prisma } from '@/lib/prisma'

import {
	toDomainFriendship,
	toPrismaFriendship,
} from '../mappers/prisma-friendships-mapper'

export class PrismaFriendshipsRepository implements FriendshipsRepository {
	async create(friendship: Friendship): Promise<void> {
		const prismaFriendship = toPrismaFriendship(friendship)

		await prisma.friendship.create({
			data: prismaFriendship,
		})
	}

	async save(friendship: Friendship): Promise<void> {
		const prismaFriendship = toPrismaFriendship(friendship)

		await prisma.friendship.update({
			where: { id: prismaFriendship.id },
			data: prismaFriendship,
		})
	}

	async delete(friendship: Friendship): Promise<void> {
		await prisma.friendship.delete({
			where: { id: friendship.id.toValue() },
		})
	}

	async findById(id: string): Promise<Friendship | null> {
		const friendship = await prisma.friendship.findUnique({
			where: { id },
		})

		return friendship ? toDomainFriendship(friendship) : null
	}

	async findByBothUserIds(
		firstUserId: string,
		secondUserId: string
	): Promise<Friendship | null> {
		const friendship = await prisma.friendship.findFirst({
			where: {
				OR: [
					{ fromUserId: firstUserId, toUserId: secondUserId },
					{ fromUserId: secondUserId, toUserId: firstUserId },
				],
			},
		})

		return friendship ? toDomainFriendship(friendship) : null
	}

	async findManyByUserId(userId: string): Promise<Friendship[]> {
		const friendships = await prisma.friendship.findMany({
			where: {
				OR: [{ fromUserId: userId }, { toUserId: userId }],
			},
		})

		return friendships.map(toDomainFriendship)
	}

	async findManyNonBlockedByUserId(
		userId: string,
		pagination: PaginationParams,
		filters?: FriendshipsListFilters
	): Promise<PaginatedResult<Friendship>> {
		const where: Prisma.FriendshipWhereInput = {
			OR: [{ fromUserId: userId }, { toUserId: userId }],
			status: {
				not: 'blocked',
				equals: filters?.status,
			},
		}

		const friendships = await prisma.friendship.findMany({
			where: {
				OR: [{ fromUserId: userId }, { toUserId: userId }],
				status: {
					not: 'blocked',
					equals: filters?.status,
				},
			},
			take: pagination.size,
			skip: (pagination.page - 1) * pagination.size,
		})

		const totalItems = await prisma.friendship.count({
			where,
		})

		return {
			items: friendships.map(toDomainFriendship),
			meta: {
				page: pagination.page,
				size: pagination.size,
				itemCount: friendships.length,
				totalItems,
				totalPages: Math.ceil(totalItems / pagination.size),
			},
		}
	}
}
