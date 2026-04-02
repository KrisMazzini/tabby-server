import type { Group } from '@/domain/tabs/enterprise/entities/group'
import type { GroupMember } from '@/domain/tabs/enterprise/value-objects/group-member'

export function toHttpGroupMemberSerializer(member: GroupMember) {
	return {
		userId: member.userId.toValue(),
		status: member.status,
		joinedAt: member.joinedAt ?? null,
	}
}

export function toHttpGroupSerializer(group: Group) {
	return {
		id: group.id.toValue(),
		name: group.name,
		ownerId: group.ownerId.toValue(),
		defaultCurrencyIso: group.defaultCurrency.iso,
		members: group.members.map(toHttpGroupMemberSerializer),
		createdAt: group.createdAt,
		updatedAt: group.updatedAt ?? null,
	}
}
