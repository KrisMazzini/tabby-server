import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { Friendship } from '../../enterprise/entities/friendship'
import { FriendshipAlreadyExistsError } from '../../errors/friendship-already-exists-error'

import type { FriendshipsRepository } from '../repositories/friendships-repository'

interface CreateFriendshipUseCaseRequest {
	fromUserId: string
	toUserId: string
}

interface CreateFriendshipUseCaseResponse {
	friendship: Friendship
}

export class CreateFriendshipUseCase {
	constructor(private friendshipsRepository: FriendshipsRepository) {}

	async execute({
		fromUserId,
		toUserId,
	}: CreateFriendshipUseCaseRequest): Promise<CreateFriendshipUseCaseResponse> {
		const existingFriendship =
			await this.friendshipsRepository.findByBothUserIds(fromUserId, toUserId)

		if (existingFriendship) {
			throw new FriendshipAlreadyExistsError()
		}

		const friendship = Friendship.create({
			fromUserId: new UniqueEntityId(fromUserId),
			toUserId: new UniqueEntityId(toUserId),
			status: 'pending',
		})

		await this.friendshipsRepository.create(friendship)

		return {
			friendship,
		}
	}
}
