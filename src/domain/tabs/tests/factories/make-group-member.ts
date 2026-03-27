import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import {
	GroupMember,
	type GroupMemberProps,
} from '../../enterprise/value-objects/group-member'

export function makeGroupMember(override: Partial<GroupMemberProps> = {}) {
	return GroupMember.create({
		userId: new UniqueEntityId(),
		status: 'accepted',
		joinedAt: faker.date.recent(),
		...override,
	})
}
