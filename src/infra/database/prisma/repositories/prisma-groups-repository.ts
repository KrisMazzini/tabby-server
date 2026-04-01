import type { Prisma } from 'generated/prisma/client'

import type {
	PaginatedResult,
	PaginationParams,
} from '@/core/pagination/pagination'
import type {
	GroupsListFilters,
	GroupsRepository,
} from '@/domain/tabs/application/repositories/groups-repository'
import type { Group } from '@/domain/tabs/enterprise/entities/group'
import { prisma } from '@/lib/prisma'

import { toDomainGroup, toPrismaGroup } from '../mappers/prisma-groups-mapper'

export class PrismaGroupsRepository implements GroupsRepository {
	async create(group: Group): Promise<void> {
		const { group: prismaGroup, members: prismaMembers } = toPrismaGroup(group)

		await prisma.$transaction(async tx => {
			await tx.group.create({
				data: prismaGroup,
			})

			await tx.groupMember.createMany({ data: prismaMembers })
		})
	}

	async save(group: Group): Promise<void> {
		const { group: prismaGroup, members: prismaMembers } = toPrismaGroup(group)

		await prisma.$transaction(async tx => {
			await tx.group.update({
				where: { id: prismaGroup.id },
				data: prismaGroup,
			})

			await tx.groupMember.deleteMany({ where: { groupId: prismaGroup.id } })

			if (prismaMembers.length > 0) {
				await tx.groupMember.createMany({ data: prismaMembers })
			}
		})
	}

	async delete(group: Group): Promise<void> {
		await prisma.group.delete({
			where: { id: group.id.toValue() },
		})
	}

	async findById(id: string): Promise<Group | null> {
		const row = await prisma.group.findUnique({
			where: { id },
			include: {
				members: true,
			},
		})

		if (!row) return null

		const { members, ...group } = row

		return toDomainGroup(group, members)
	}

	async findManyByMemberId(
		memberId: string,
		pagination: PaginationParams,
		filters?: GroupsListFilters
	): Promise<PaginatedResult<Group>> {
		const memberFilter: Prisma.GroupMemberWhereInput = {
			userId: memberId,
			status: filters?.membershipStatus,
		}

		const where: Prisma.GroupWhereInput = {
			members: { some: memberFilter },
			ownerId: filters?.ownership === 'owner' ? memberId : undefined,
		}

		const q = filters?.q?.trim()
		if (q) {
			where.name = { contains: q, mode: 'insensitive' }
		}

		const rows = await prisma.group.findMany({
			where,
			include: {
				members: true,
			},
			orderBy: { updatedAt: 'desc' },
			take: pagination.size,
			skip: (pagination.page - 1) * pagination.size,
		})

		const totalItems = await prisma.group.count({ where })

		const groups = rows.map(row => {
			const { members, ...group } = row
			return toDomainGroup(group, members)
		})

		return {
			items: groups,
			meta: {
				page: pagination.page,
				size: pagination.size,
				itemCount: rows.length,
				totalItems,
				totalPages:
					pagination.size === 0 ? 0 : Math.ceil(totalItems / pagination.size),
			},
		}
	}
}
