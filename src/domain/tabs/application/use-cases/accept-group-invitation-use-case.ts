import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { GroupMember } from '../../enterprise/value-objects/group-member'

import type { GroupsRepository } from '../repositories/groups-repository'

interface AcceptGroupInvitationUseCaseRequest {
	groupId: string
	memberId: string
}

interface AcceptGroupInvitationUseCaseResponse {
	member: GroupMember
}

export class AcceptGroupInvitationUseCase {
	constructor(private groupsRepository: GroupsRepository) {}

	async execute({
		groupId,
		memberId,
	}: AcceptGroupInvitationUseCaseRequest): Promise<AcceptGroupInvitationUseCaseResponse> {
		const group = await this.groupsRepository.findById(groupId)

		if (!group) {
			throw new ResourceNotFoundError('Group')
		}

		const memberUniqueId = new UniqueEntityId(memberId)

		const member = group.acceptMemberInvitation(memberUniqueId)

		await this.groupsRepository.save(group)

		return { member }
	}
}
