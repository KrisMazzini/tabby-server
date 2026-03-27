import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { SelfFriendshipError } from '../../errors/self-friendship-error'
import { Friendship } from './friendship'

describe('Tabs | Entity: Friendship', () => {
	it('should be possible to create a friendship', () => {
		const friendship = Friendship.create({
			fromUserId: new UniqueEntityId('user-1'),
			toUserId: new UniqueEntityId('user-2'),
			status: 'pending',
		})

		expect(friendship.fromUserId.toString()).toBe('user-1')
		expect(friendship.toUserId.toString()).toBe('user-2')
		expect(friendship.status).toBe('pending')
	})

	it('should not be possible to create a friendship with yourself', () => {
		expect(() =>
			Friendship.create({
				fromUserId: new UniqueEntityId('user-1'),
				toUserId: new UniqueEntityId('user-1'),
				status: 'pending',
			})
		).toThrow(SelfFriendshipError)
	})
})
