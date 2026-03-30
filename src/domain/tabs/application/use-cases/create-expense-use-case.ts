import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { Expense } from '../../enterprise/entities/expense'
import type { Currency } from '../../enterprise/value-objects/currency'

import {
	type ExpenseSplitRaw,
	toExpenseSplit,
} from '../mappers/expense-split-mapper'
import type { ExpensesRepository } from '../repositories/expenses-repository'

interface CreateExpenseUseCaseRequest {
	payerId: string
	description: string
	currency: Currency
	totalAmountInCents: number
	date: Date
	groupId?: string
	split: ExpenseSplitRaw
}

interface CreateExpenseUseCaseResponse {
	expense: Expense
}

export class CreateExpenseUseCase {
	constructor(private expensesRepository: ExpensesRepository) {}

	async execute({
		payerId,
		description,
		currency,
		totalAmountInCents,
		date,
		groupId,
		split,
	}: CreateExpenseUseCaseRequest): Promise<CreateExpenseUseCaseResponse> {
		const splitDomain = toExpenseSplit(split)

		const expense = Expense.create({
			payerId: new UniqueEntityId(payerId),
			description,
			currency,
			totalAmountInCents,
			date,
			groupId: groupId ? new UniqueEntityId(groupId) : undefined,
			split: splitDomain,
		})

		await this.expensesRepository.create(expense)

		return { expense }
	}
}
