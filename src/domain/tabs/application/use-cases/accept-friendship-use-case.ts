import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { Friendship } from '../../enterprise/entities/friendship'
import { FriendshipNotPendingError } from '../../errors/friendship-not-pending-error'

import type { FriendshipsRepository } from '../repositories/friendships-repository'

interface AcceptFriendshipUseCaseRequest {
	userId: string
	friendshipId: string
}

interface AcceptFriendshipUseCaseResponse {
	friendship: Friendship
}

export class AcceptFriendshipUseCase {
	constructor(private friendshipsRepository: FriendshipsRepository) {}

	async execute({
		userId,
		friendshipId,
	}: AcceptFriendshipUseCaseRequest): Promise<AcceptFriendshipUseCaseResponse> {
		const friendship = await this.friendshipsRepository.findById(friendshipId)

		if (!friendship) {
			throw new ResourceNotFoundError('Friendship')
		}

		const isInvitee = friendship.toUserId.toValue() === userId

		if (!isInvitee) {
			throw new NotAllowedError()
		}

		const isPending = friendship.status === 'pending'

		if (!isPending) {
			throw new FriendshipNotPendingError()
		}

		friendship.status = 'accepted'

		await this.friendshipsRepository.save(friendship)

		return {
			friendship,
		}
	}
}
