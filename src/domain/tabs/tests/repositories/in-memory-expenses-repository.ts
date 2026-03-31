import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
	type PaginationParams,
	paginateInMemory,
} from '@/core/pagination/pagination'

import type {
	ExpensesListFilters,
	ExpensesRepository,
} from '../../application/repositories/expenses-repository'
import type { Expense } from '../../enterprise/entities/expense'

export class InMemoryExpensesRepository implements ExpensesRepository {
	public items: Expense[] = []

	async create(expense: Expense) {
		this.items.push(expense)
	}

	async save(expense: Expense) {
		const index = this.items.findIndex(item => item.id.equals(expense.id))
		this.items[index] = expense
	}

	async delete(expense: Expense) {
		const index = this.items.findIndex(item => item.id.equals(expense.id))
		this.items.splice(index, 1)
	}

	async findById(id: string) {
		const item = this.items.find(item => item.id.equals(new UniqueEntityId(id)))

		return item ?? null
	}

	async findManyByUserId(
		userId: string,
		pagination: PaginationParams,
		filters?: ExpensesListFilters
	) {
		let items = this.items.filter(
			item =>
				item.payerId.toString() === userId ||
				item.split.slices.some(slice => slice.userId.toString() === userId)
		)

		if (filters?.groupId) {
			items = items.filter(item => item.groupId?.toString() === filters.groupId)
		}

		if (filters?.friendId) {
			items = items.filter(
				item =>
					item.payerId.toString() === filters.friendId ||
					item.split.slices.some(
						slice => slice.userId.toString() === filters.friendId
					)
			)
		}

		return paginateInMemory(items, pagination)
	}
}
