import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
	type PaginationParams,
	paginateInMemory,
} from '@/core/pagination/pagination'

import type {
	PaymentsListFilters,
	PaymentsRepository,
} from '../../application/repositories/payments-repository'
import type { Payment } from '../../enterprise/entities/payment'

export class InMemoryPaymentsRepository implements PaymentsRepository {
	public items: Payment[] = []

	async create(payment: Payment) {
		this.items.push(payment)
	}

	async save(payment: Payment) {
		const index = this.items.findIndex(item => item.id.equals(payment.id))
		this.items[index] = payment
	}

	async delete(payment: Payment) {
		const index = this.items.findIndex(item => item.id.equals(payment.id))
		this.items.splice(index, 1)
	}

	async findById(id: string) {
		const item = this.items.find(item => item.id.equals(new UniqueEntityId(id)))
		return item ?? null
	}

	async findManyByUserId(
		userId: string,
		pagination: PaginationParams,
		filters?: PaymentsListFilters
	) {
		let items = this.items.filter(
			item =>
				item.payerId.equals(new UniqueEntityId(userId)) ||
				item.receiverId.equals(new UniqueEntityId(userId))
		)

		if (filters?.role === 'payer') {
			items = items.filter(item =>
				item.payerId.equals(new UniqueEntityId(userId))
			)
		}

		if (filters?.role === 'receiver') {
			items = items.filter(item =>
				item.receiverId.equals(new UniqueEntityId(userId))
			)
		}

		if (filters?.groupId) {
			items = items.filter(item => item.groupId?.toString() === filters.groupId)
		}

		return paginateInMemory(items, pagination)
	}
}
