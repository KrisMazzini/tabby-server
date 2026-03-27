import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { GroupsRepository } from '../repositories/groups-repository'

interface DeleteGroupUseCaseRequest {
	groupId: string
	userId: string
}

export class DeleteGroupUseCase {
	constructor(private groupsRepository: GroupsRepository) {}

	async execute({ groupId, userId }: DeleteGroupUseCaseRequest): Promise<void> {
		const group = await this.groupsRepository.findById(groupId)

		if (!group) {
			throw new ResourceNotFoundError('Group')
		}

		if (!group.ownerId.equals(new UniqueEntityId(userId))) {
			throw new NotAllowedError()
		}

		await this.groupsRepository.delete(group)
	}
}
