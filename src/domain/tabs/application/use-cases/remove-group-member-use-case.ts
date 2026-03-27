import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { GroupMember } from '../../enterprise/value-objects/group-member'

import type { GroupsRepository } from '../repositories/groups-repository'

interface RemoveGroupMemberUseCaseRequest {
	groupId: string
	userId: string
	memberId: string
}

interface RemoveGroupMemberUseCaseResponse {
	members: GroupMember[]
}

export class RemoveGroupMemberUseCase {
	constructor(private groupsRepository: GroupsRepository) {}

	async execute({
		groupId,
		userId,
		memberId,
	}: RemoveGroupMemberUseCaseRequest): Promise<RemoveGroupMemberUseCaseResponse> {
		const group = await this.groupsRepository.findById(groupId)

		if (!group) {
			throw new ResourceNotFoundError('Group')
		}

		if (group.ownerId.toValue() !== userId) {
			throw new NotAllowedError()
		}

		group.removeMember(new UniqueEntityId(memberId))

		await this.groupsRepository.save(group)

		return { members: [...group.members] }
	}
}
