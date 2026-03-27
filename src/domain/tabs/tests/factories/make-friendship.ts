import { faker } from '@faker-js/faker'

import type { EntityArgs } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import {
	Friendship,
	type FriendshipProps,
} from '../../enterprise/entities/friendship'

export function makeFriendship(
	override: Partial<FriendshipProps> = {},
	args?: EntityArgs
) {
	const friendship = Friendship.create(
		{
			fromUserId: new UniqueEntityId(),
			toUserId: new UniqueEntityId(),
			status: faker.helpers.arrayElement(['pending', 'accepted', 'blocked']),
			...override,
		},
		args
	)

	return friendship
}
