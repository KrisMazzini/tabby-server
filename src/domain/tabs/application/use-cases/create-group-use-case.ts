import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { Group } from '../../enterprise/entities/group'
import type { Currency } from '../../enterprise/value-objects/currency'
import { GroupMember } from '../../enterprise/value-objects/group-member'

import type { GroupsRepository } from '../repositories/groups-repository'

interface CreateGroupUseCaseRequest {
	ownerId: string
	defaultCurrency: Currency
	name: string
	inviteeIds?: string[]
}

interface CreateGroupUseCaseResponse {
	group: Group
}

export class CreateGroupUseCase {
	constructor(private groupsRepository: GroupsRepository) {}

	async execute({
		ownerId,
		defaultCurrency,
		name,
		inviteeIds = [],
	}: CreateGroupUseCaseRequest): Promise<CreateGroupUseCaseResponse> {
		const ownerUniqueId = new UniqueEntityId(ownerId)
		const joinedAt = new Date()

		const group = Group.create({
			name,
			ownerId: ownerUniqueId,
			defaultCurrency,
			members: [GroupMember.accepted(ownerUniqueId, joinedAt)],
		})

		const idsToInvite = new Set(inviteeIds)

		for (const userId of idsToInvite) {
			if (userId === ownerId) {
				continue
			}

			group.addMember(new UniqueEntityId(userId))
		}

		await this.groupsRepository.create(group)

		return { group }
	}
}
