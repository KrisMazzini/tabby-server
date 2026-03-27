import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { GroupMember } from '../../enterprise/value-objects/group-member'

import type { GroupsRepository } from '../repositories/groups-repository'

interface InviteMemberUseCaseRequest {
	groupId: string
	senderId: string
	inviteeId: string
}

interface InviteMemberUseCaseResponse {
	member: GroupMember
}

export class InviteMemberUseCase {
	constructor(private groupsRepository: GroupsRepository) {}

	async execute({
		groupId,
		senderId,
		inviteeId,
	}: InviteMemberUseCaseRequest): Promise<InviteMemberUseCaseResponse> {
		const group = await this.groupsRepository.findById(groupId)

		if (!group) {
			throw new ResourceNotFoundError('Group')
		}

		const senderUniqueId = new UniqueEntityId(senderId)

		if (!group.hasAcceptedMember(senderUniqueId)) {
			throw new NotAllowedError()
		}

		const member = group.addMember(new UniqueEntityId(inviteeId))

		await this.groupsRepository.save(group)

		return { member }
	}
}
