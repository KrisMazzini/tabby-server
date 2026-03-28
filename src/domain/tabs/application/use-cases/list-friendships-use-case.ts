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
	friendUserIds: string[]
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

		const friendUserIds = items.map(friendship => {
			const from = friendship.fromUserId.toValue()
			const to = friendship.toUserId.toValue()
			return from === userId ? to : from
		})

		return { friendUserIds, meta }
	}
}
