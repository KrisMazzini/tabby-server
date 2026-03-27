import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FriendshipNotPendingError } from '../../errors/friendship-not-pending-error'
import { makeFriendship } from '../../tests/factories/make-friendship'
import { InMemoryFriendshipsRepository } from '../../tests/repositories/in-memory-friendships-repository'

import { AcceptFriendshipUseCase } from './accept-friendship-use-case'

let friendshipsRepository: InMemoryFriendshipsRepository
let sut: AcceptFriendshipUseCase

describe('Tabs | Use Case: AcceptFriendship', () => {
	beforeEach(() => {
		friendshipsRepository = new InMemoryFriendshipsRepository()

		sut = new AcceptFriendshipUseCase(friendshipsRepository)
	})

	it('should be possible to accept a friendship', async () => {
		await friendshipsRepository.create(
			makeFriendship(
				{
					toUserId: new UniqueEntityId('user-1'),
					status: 'pending',
				},
				{
					id: new UniqueEntityId('friendship-1'),
				}
			)
		)

		const { friendship } = await sut.execute({
			userId: 'user-1',
			friendshipId: 'friendship-1',
		})

		expect(friendship.status).toBe('accepted')
		expect(friendshipsRepository.items[0].status).toBe('accepted')
	})

	it('should not be possible to accept a friendship that does not exist', async () => {
		await expect(
			sut.execute({
				userId: 'user-1',
				friendshipId: 'non-existent-friendship-id',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be possible to accept a friendship that is not pending', async () => {
		friendshipsRepository.items.push(
			makeFriendship(
				{
					toUserId: new UniqueEntityId('user-1'),
					status: 'accepted',
				},
				{
					id: new UniqueEntityId('friendship-1'),
				}
			)
		)

		await expect(
			sut.execute({
				userId: 'user-1',
				friendshipId: 'friendship-1',
			})
		).rejects.toBeInstanceOf(FriendshipNotPendingError)
	})

	it("should not be possible to accept a friendship that is not the user's", async () => {
		friendshipsRepository.items.push(
			makeFriendship(
				{
					toUserId: new UniqueEntityId('user-1'),
					status: 'pending',
				},
				{
					id: new UniqueEntityId('friendship-1'),
				}
			)
		)

		await expect(
			sut.execute({
				userId: 'user-2',
				friendshipId: 'friendship-1',
			})
		).rejects.toBeInstanceOf(NotAllowedError)
	})
})
