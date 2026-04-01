import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { makeFriendship } from '../../tests/factories/make-friendship'
import { InMemoryFriendshipsRepository } from '../../tests/repositories/in-memory-friendships-repository'

import { ListFriendshipsUseCase } from './list-friendships-use-case'

let friendshipsRepository: InMemoryFriendshipsRepository
let sut: ListFriendshipsUseCase

const userId = new UniqueEntityId('alice')

const sentFriendship = makeFriendship(
	{
		fromUserId: userId,
		toUserId: new UniqueEntityId('bob'),
		status: 'accepted',
	},
	{
		id: new UniqueEntityId('bob-friendship'),
	}
)

const receivedFriendship = makeFriendship(
	{
		fromUserId: new UniqueEntityId('carol'),
		toUserId: userId,
		status: 'pending',
	},
	{
		id: new UniqueEntityId('carol-friendship'),
	}
)

const blockedFriendship = makeFriendship(
	{
		fromUserId: new UniqueEntityId('dave'),
		toUserId: userId,
		status: 'blocked',
	},
	{
		id: new UniqueEntityId('dave-friendship'),
	}
)

describe('Tabs | Use Case: ListFriendships', () => {
	beforeEach(() => {
		friendshipsRepository = new InMemoryFriendshipsRepository()
		sut = new ListFriendshipsUseCase(friendshipsRepository)
	})

	it('should return a list of non-blocked friendships', async () => {
		await friendshipsRepository.create(sentFriendship)
		await friendshipsRepository.create(receivedFriendship)

		const { friendships } = await sut.execute({ userId: 'alice' })

		expect(friendships).toEqual([
			{
				id: new UniqueEntityId('bob-friendship'),
				friend: { id: new UniqueEntityId('bob') },
				status: 'accepted',
			},
			{
				id: new UniqueEntityId('carol-friendship'),
				friend: { id: new UniqueEntityId('carol') },
				status: 'pending',
			},
		])
	})

	it('should not include blocked friendships', async () => {
		await friendshipsRepository.create(blockedFriendship)

		const { friendships } = await sut.execute({ userId: 'alice' })

		expect(friendships).toEqual([])
	})

	it('should filter by status', async () => {
		await friendshipsRepository.create(sentFriendship)
		await friendshipsRepository.create(receivedFriendship)

		const { friendships, meta } = await sut.execute({
			userId: 'alice',
			filters: { status: 'pending' },
		})

		expect(friendships).toEqual([
			{
				id: new UniqueEntityId('carol-friendship'),
				friend: { id: new UniqueEntityId('carol') },
				status: 'pending',
			},
		])
		expect(meta.totalItems).toBe(1)
	})

	it('should return an empty list when the user has no friendships', async () => {
		const { friendships } = await sut.execute({ userId: 'nobody' })

		expect(friendships).toEqual([])
	})

	it('should paginate with default page size', async () => {
		for (let i = 0; i < 25; i++) {
			await friendshipsRepository.create(
				makeFriendship({
					fromUserId: new UniqueEntityId('alice'),
					toUserId: new UniqueEntityId(`user-${i}`),
					status: 'accepted',
				})
			)
		}

		const first = await sut.execute({ userId: 'alice' })

		expect(first.friendships).toHaveLength(20)
		expect(first.meta).toEqual({
			page: 1,
			size: 20,
			itemCount: 20,
			totalItems: 25,
			totalPages: 2,
		})

		const second = await sut.execute({ userId: 'alice', page: 2 })

		expect(second.friendships).toHaveLength(5)
		expect(second.meta).toEqual({
			page: 2,
			size: 20,
			itemCount: 5,
			totalItems: 25,
			totalPages: 2,
		})
	})

	it('should respect custom page size', async () => {
		for (let i = 0; i < 5; i++) {
			await friendshipsRepository.create(
				makeFriendship({
					fromUserId: new UniqueEntityId('alice'),
					toUserId: new UniqueEntityId(`u${i}`),
					status: 'accepted',
				})
			)
		}

		const { friendships, meta } = await sut.execute({
			userId: 'alice',
			page: 1,
			size: 2,
		})

		expect(friendships).toHaveLength(2)
		expect(meta).toEqual({
			page: 1,
			size: 2,
			itemCount: 2,
			totalItems: 5,
			totalPages: 3,
		})
	})
})
