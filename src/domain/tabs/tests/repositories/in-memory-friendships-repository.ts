import {
	type PaginationParams,
	paginateInMemory,
} from '@/core/pagination/pagination'

import type {
	FriendshipsListFilters,
	FriendshipsRepository,
} from '../../application/repositories/friendships-repository'
import type { Friendship } from '../../enterprise/entities/friendship'

export class InMemoryFriendshipsRepository implements FriendshipsRepository {
	public items: Friendship[] = []

	async create(friendship: Friendship) {
		this.items.push(friendship)
	}

	async save(friendship: Friendship) {
		const itemIndex = this.items.findIndex(item => item.id === friendship.id)

		this.items[itemIndex] = friendship
	}

	async delete(friendship: Friendship) {
		const itemIndex = this.items.findIndex(item => item.id === friendship.id)

		this.items.splice(itemIndex, 1)
	}

	async findById(id: string) {
		const item = this.items.find(item => item.id.toValue() === id)

		return item ?? null
	}

	async findByBothUserIds(firstUserId: string, secondUserId: string) {
		const userIds = [firstUserId, secondUserId]

		const item = this.items.find(
			item =>
				userIds.includes(item.fromUserId.toValue()) &&
				userIds.includes(item.toUserId.toValue())
		)

		return item ?? null
	}

	async findManyByUserId(userId: string) {
		return this.items.filter(
			item =>
				item.fromUserId.toValue() === userId ||
				item.toUserId.toValue() === userId
		)
	}

	async findManyNonBlockedByUserId(
		userId: string,
		pagination: PaginationParams,
		filters?: FriendshipsListFilters
	) {
		let items = await this.findManyByUserId(userId)

		items = items.filter(item => item.status !== 'blocked')

		if (filters?.status) {
			const status = filters.status
			items = items.filter(item => item.status === status)
		}

		return paginateInMemory(items, pagination)
	}
}
