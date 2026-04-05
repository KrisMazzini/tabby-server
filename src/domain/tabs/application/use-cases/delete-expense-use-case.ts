import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { ExpensesRepository } from '../repositories/expenses-repository'

export interface DeleteExpenseUseCaseRequest {
	expenseId: string
	userId: string
}

export class DeleteExpenseUseCase {
	constructor(private expensesRepository: ExpensesRepository) {}

	async execute({
		expenseId,
		userId,
	}: DeleteExpenseUseCaseRequest): Promise<void> {
		const expense = await this.expensesRepository.findById(expenseId)

		if (!expense) {
			throw new ResourceNotFoundError('Expense')
		}

		if (!expense.payerId.equals(new UniqueEntityId(userId))) {
			throw new NotAllowedError()
		}

		await this.expensesRepository.delete(expense)
	}
}
