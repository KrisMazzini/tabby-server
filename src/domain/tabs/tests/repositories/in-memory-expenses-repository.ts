import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import type { ExpensesRepository } from '../../application/repositories/expenses-repository'
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
}
