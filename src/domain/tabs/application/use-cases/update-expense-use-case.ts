import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { Expense } from '../../enterprise/entities/expense'
import type { Currency } from '../../enterprise/value-objects/currency'

import {
	type ExpenseSplitRaw,
	toExpenseSplit,
} from '../mappers/expense-split-mapper'
import type { ExpensesRepository } from '../repositories/expenses-repository'

interface UpdateExpenseUseCaseRequest {
	expenseId: string
	userId: string
	payerId: string
	description: string
	currency: Currency
	totalAmountInCents: number
	date: Date
	groupId?: string
	split: ExpenseSplitRaw
}

interface UpdateExpenseUseCaseResponse {
	expense: Expense
}

export class UpdateExpenseUseCase {
	constructor(private expensesRepository: ExpensesRepository) {}

	async execute({
		expenseId,
		userId,
		payerId,
		description,
		currency,
		totalAmountInCents,
		date,
		groupId,
		split,
	}: UpdateExpenseUseCaseRequest): Promise<UpdateExpenseUseCaseResponse> {
		const expense = await this.expensesRepository.findById(expenseId)

		if (!expense) {
			throw new ResourceNotFoundError('Expense')
		}

		if (!expense.payerId.equals(new UniqueEntityId(userId))) {
			throw new NotAllowedError()
		}

		expense.payerId = new UniqueEntityId(payerId)
		expense.description = description
		expense.currency = currency
		expense.date = date
		expense.groupId = groupId ? new UniqueEntityId(groupId) : undefined
		expense.redistribute(totalAmountInCents, toExpenseSplit(split))

		await this.expensesRepository.save(expense)

		return { expense }
	}
}
