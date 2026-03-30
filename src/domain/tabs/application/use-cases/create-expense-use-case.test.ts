import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { EqualSlice } from '../../enterprise/value-objects/slice'
import { makeCurrency } from '../../tests/factories/make-currency'
import { InMemoryExpensesRepository } from '../../tests/repositories/in-memory-expenses-repository'

import { CreateExpenseUseCase } from './create-expense-use-case'

let expensesRepository: InMemoryExpensesRepository
let sut: CreateExpenseUseCase

describe('Tabs | Use Case: CreateExpense', () => {
	beforeEach(() => {
		expensesRepository = new InMemoryExpensesRepository()
		sut = new CreateExpenseUseCase(expensesRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create an expense and persist it', async () => {
		vi.setSystemTime(new Date('2026-03-01T12:00:00.000Z'))

		const currency = makeCurrency()
		const date = new Date()

		const { expense } = await sut.execute({
			payerId: 'payer-1',
			description: 'Dinner',
			currency,
			totalAmountInCents: 10_000,
			date,
			split: {
				kind: 'equally',
				slices: [{ userId: 'user-a' }, { userId: 'user-b' }],
			},
		})

		expect(expense.payerId.toString()).toBe('payer-1')
		expect(expense.description).toBe('Dinner')
		expect(expense.currency).toEqual(currency)
		expect(expense.totalAmountInCents).toBe(10_000)
		expect(expense.date).toEqual(new Date('2026-03-01T12:00:00.000Z'))
		expect(expense.groupId).toBeUndefined()
		expect(expense.split).toEqual({
			kind: 'equally',
			slices: [
				EqualSlice.create(new UniqueEntityId('user-a')),
				EqualSlice.create(new UniqueEntityId('user-b')),
			],
		})

		expect(expensesRepository.items).toEqual([expense])
	})

	it('should attach an optional group id', async () => {
		const { expense } = await sut.execute({
			payerId: 'payer-1',
			description: 'Trip',
			currency: makeCurrency(),
			totalAmountInCents: 5000,
			date: new Date(),
			groupId: 'group-1',
			split: {
				kind: 'equally',
				slices: [{ userId: 'user-a' }],
			},
		})

		expect(expense.groupId).toEqual(new UniqueEntityId('group-1'))
	})
})
