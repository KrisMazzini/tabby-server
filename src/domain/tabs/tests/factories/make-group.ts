import { faker } from '@faker-js/faker'

import type { EntityArgs } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { Group, type GroupProps } from '../../enterprise/entities/group'
import { GroupMember } from '../../enterprise/value-objects/group-member'

import { makeCurrency } from './make-currency'

export function makeGroup(
	override: Partial<GroupProps> = {},
	args?: EntityArgs
) {
	const ownerId = override.ownerId ?? new UniqueEntityId()

	return Group.create(
		{
			name: faker.commerce.department(),
			defaultCurrency: makeCurrency(),
			ownerId,
			members: [GroupMember.accepted(ownerId, new Date())],
			...override,
		},
		args
	)
}
