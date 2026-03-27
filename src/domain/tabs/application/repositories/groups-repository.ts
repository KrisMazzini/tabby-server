import type {
	PaginatedResult,
	PaginationParams,
} from '@/core/pagination/pagination'

import type { Group } from '../../enterprise/entities/group'

export interface GroupsListFilters {
	membershipStatus?: 'pending' | 'accepted'
	ownership?: 'owner'
	q?: string
}

export interface GroupsRepository {
	create(group: Group): Promise<void>

	save(group: Group): Promise<void>

	delete(group: Group): Promise<void>

	findById(id: string): Promise<Group | null>

	findManyByMemberId(
		memberId: string,
		pagination: PaginationParams,
		filters?: GroupsListFilters
	): Promise<PaginatedResult<Group>>
}
