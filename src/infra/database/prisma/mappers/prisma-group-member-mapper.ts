import type { GroupMember as PrismaGroupMember } from 'generated/prisma/client'

import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { GroupMember } from '@/domain/tabs/enterprise/value-objects/group-member'

export function toPrismaGroupMember(
	groupId: UniqueEntityId,
	member: GroupMember
): PrismaGroupMember {
	return {
		groupId: groupId.toString(),
		userId: member.userId.toString(),
		status: member.status,
		joinedAt: member.joinedAt ?? null,
	}
}

export function toDomainGroupMember(row: PrismaGroupMember): GroupMember {
	return GroupMember.create({
		userId: new UniqueEntityId(row.userId),
		status: row.status,
		joinedAt: row.joinedAt ?? undefined,
	})
}
