import type {
	Group as PrismaGroup,
	GroupMember as PrismaGroupMember,
} from 'generated/prisma/client'

import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Group } from '@/domain/tabs/enterprise/entities/group'
import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'

import {
	toDomainGroupMember,
	toPrismaGroupMember,
} from './prisma-group-member-mapper'

export type PrismaGroupWithMembers = PrismaGroup & {
	members: PrismaGroupMember[]
}

export function toPrismaGroup(group: Group): {
	group: PrismaGroup
	members: PrismaGroupMember[]
} {
	const prismaGroup: PrismaGroup = {
		id: group.id.toValue(),
		name: group.name,
		ownerId: group.ownerId.toValue(),
		defaultCurrencyIso: group.defaultCurrency.iso,
		createdAt: group.createdAt,
		updatedAt: group.updatedAt ?? null,
	}

	const prismaMembers: PrismaGroupMember[] = group.members.map(member =>
		toPrismaGroupMember(group.id, member)
	)

	return {
		group: prismaGroup,
		members: prismaMembers,
	}
}

export function toDomainGroup(
	groupRow: PrismaGroup,
	memberRows: PrismaGroupMember[]
): Group {
	const defaultCurrency = Currency.create({
		iso: groupRow.defaultCurrencyIso,
	})

	return Group.create(
		{
			name: groupRow.name,
			ownerId: new UniqueEntityId(groupRow.ownerId),
			defaultCurrency,
			members: memberRows.map(toDomainGroupMember),
		},
		{
			id: new UniqueEntityId(groupRow.id),
			createdAt: groupRow.createdAt,
			updatedAt: groupRow.updatedAt ?? undefined,
		}
	)
}
