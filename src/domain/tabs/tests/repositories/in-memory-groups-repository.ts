import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
	type PaginationParams,
	paginateInMemory,
} from '@/core/pagination/pagination'

import type {
	GroupsListFilters,
	GroupsRepository,
} from '../../application/repositories/groups-repository'
import type { Group } from '../../enterprise/entities/group'

export class InMemoryGroupsRepository implements GroupsRepository {
	public items: Group[] = []

	async create(group: Group) {
		this.items.push(group)
	}

	async save(group: Group) {
		const index = this.items.findIndex(item => item.id.equals(group.id))
		this.items[index] = group
	}

	async delete(group: Group) {
		const index = this.items.findIndex(item => item.id.equals(group.id))
		this.items.splice(index, 1)
	}

	async findById(id: string) {
		const item = this.items.find(item => item.id.equals(new UniqueEntityId(id)))

		return item ?? null
	}

	async findManyByMemberId(
		memberId: string,
		pagination: PaginationParams,
		filters?: GroupsListFilters
	) {
		const uid = new UniqueEntityId(memberId)

		let items = this.items.filter(item =>
			item.members.some(member => member.userId.equals(uid))
		)

		if (filters?.membershipStatus) {
			const status = filters.membershipStatus

			items = items.filter(item => {
				const member = item.members.find(member => member.userId.equals(uid))
				return member?.status === status
			})
		}

		if (filters?.ownership === 'owner') {
			items = items.filter(item => item.ownerId.equals(uid))
		}

		const query = filters?.q?.trim().toLowerCase()
		if (query) {
			items = items.filter(item => item.name.toLowerCase().includes(query))
		}

		return paginateInMemory(items, pagination)
	}
}
