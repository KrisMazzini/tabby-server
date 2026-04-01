import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { Group } from '../../enterprise/entities/group'
import type { Currency } from '../../enterprise/value-objects/currency'
import type { GroupsRepository } from '../repositories/groups-repository'

interface UpdateGroupUseCaseRequest {
	groupId: string
	userId: string
	name: string
	defaultCurrency: Currency
}

interface UpdateGroupUseCaseResponse {
	group: Group
}

export class UpdateGroupUseCase {
	constructor(private groupsRepository: GroupsRepository) {}

	async execute({
		groupId,
		userId,
		name,
		defaultCurrency,
	}: UpdateGroupUseCaseRequest): Promise<UpdateGroupUseCaseResponse> {
		const group = await this.groupsRepository.findById(groupId)

		if (!group) {
			throw new ResourceNotFoundError('Group')
		}

		if (!group.hasAcceptedMember(new UniqueEntityId(userId))) {
			throw new NotAllowedError()
		}

		group.name = name
		group.defaultCurrency = defaultCurrency

		await this.groupsRepository.save(group)

		return { group }
	}
}
