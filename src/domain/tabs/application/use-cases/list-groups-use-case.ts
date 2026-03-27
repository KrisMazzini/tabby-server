import type {
	PaginationMeta,
	PaginationParams,
} from '@/core/pagination/pagination'

import type { Group } from '../../enterprise/entities/group'

import type {
	GroupsListFilters,
	GroupsRepository,
} from '../repositories/groups-repository'

interface ListGroupsUseCaseRequest {
	userId: string
	page?: number
	size?: number
	filters?: GroupsListFilters
}

interface ListGroupsUseCaseResponse {
	groups: Group[]
	meta: PaginationMeta
}

export class ListGroupsUseCase {
	constructor(private groupsRepository: GroupsRepository) {}

	async execute({
		userId,
		page = 1,
		size = 20,
		filters,
	}: ListGroupsUseCaseRequest): Promise<ListGroupsUseCaseResponse> {
		const pagination: PaginationParams = { page, size }

		const { items, meta } = await this.groupsRepository.findManyByMemberId(
			userId,
			pagination,
			filters
		)

		return { groups: items, meta }
	}
}
