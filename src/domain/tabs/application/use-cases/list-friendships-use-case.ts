import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import type {
	PaginationMeta,
	PaginationParams,
} from '@/core/pagination/pagination'

import type {
	FriendshipsListFilters,
	FriendshipsRepository,
} from '../repositories/friendships-repository'

interface ListFriendshipsUseCaseRequest {
	userId: string
	page?: number
	size?: number
	filters?: FriendshipsListFilters
}

interface ListFriendshipsUseCaseResponse {
	friendships: {
		id: UniqueEntityId
		friend: { id: UniqueEntityId }
		status: 'pending' | 'accepted' | 'blocked'
	}[]
	meta: PaginationMeta
}

export class ListFriendshipsUseCase {
	constructor(private friendshipsRepository: FriendshipsRepository) {}

	async execute({
		userId,
		page = 1,
		size = 20,
		filters,
	}: ListFriendshipsUseCaseRequest): Promise<ListFriendshipsUseCaseResponse> {
		const pagination: PaginationParams = { page, size }

		const { items, meta } =
			await this.friendshipsRepository.findManyNonBlockedByUserId(
				userId,
				pagination,
				filters
			)

		const friendships = items.map(friendship => {
			const from = friendship.fromUserId
			const to = friendship.toUserId

			return {
				id: friendship.id,
				friend: {
					id: from.toString() === userId ? to : from,
				},
				status: friendship.status,
			}
		})

		return { friendships, meta }
	}
}
