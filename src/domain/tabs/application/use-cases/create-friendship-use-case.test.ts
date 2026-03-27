import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { FriendshipAlreadyExistsError } from '../../errors/friendship-already-exists-error'
import { makeFriendship } from '../../tests/factories/make-friendship'
import { InMemoryFriendshipsRepository } from '../../tests/repositories/in-memory-friendships-repository'

import { CreateFriendshipUseCase } from './create-friendship-use-case'

let friendshipsRepository: InMemoryFriendshipsRepository
let sut: CreateFriendshipUseCase

describe('Tabs | Use Case: CreateFriendship', () => {
	beforeEach(() => {
		friendshipsRepository = new InMemoryFriendshipsRepository()

		sut = new CreateFriendshipUseCase(friendshipsRepository)
	})

	it('should be possible to create a friendship', async () => {
		const { friendship } = await sut.execute({
			fromUserId: 'user-1',
			toUserId: 'user-2',
		})

		expect(friendship.fromUserId.toString()).toBe('user-1')
		expect(friendship.toUserId.toString()).toBe('user-2')
		expect(friendshipsRepository.items).toEqual([friendship])
	})

	it('should create a friendship with pending status', async () => {
		const { friendship } = await sut.execute({
			fromUserId: 'user-1',
			toUserId: 'user-2',
		})

		expect(friendship.status).toBe('pending')
	})

	it('should not be possible to create a friendship that already exists', async () => {
		const friendship = makeFriendship({
			fromUserId: new UniqueEntityId('user-1'),
			toUserId: new UniqueEntityId('user-2'),
		})

		await friendshipsRepository.create(friendship)

		await expect(
			sut.execute({
				fromUserId: 'user-1',
				toUserId: 'user-2',
			})
		).rejects.toBeInstanceOf(FriendshipAlreadyExistsError)
		await expect(
			sut.execute({
				fromUserId: 'user-2',
				toUserId: 'user-1',
			})
		).rejects.toBeInstanceOf(FriendshipAlreadyExistsError)
	})
})
