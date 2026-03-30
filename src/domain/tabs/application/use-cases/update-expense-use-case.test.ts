import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import {
	EqualSlice,
	PercentageSlice,
} from '../../enterprise/value-objects/slice'
import { makeCurrency } from '../../tests/factories/make-currency'
import { makeExpense } from '../../tests/factories/make-expense'
import { InMemoryExpensesRepository } from '../../tests/repositories/in-memory-expenses-repository'

import { UpdateExpenseUseCase } from './update-expense-use-case'

let expensesRepository: InMemoryExpensesRepository
let sut: UpdateExpenseUseCase

describe('Tabs | Use Case: UpdateExpense', () => {
	beforeEach(() => {
		expensesRepository = new InMemoryExpensesRepository()
		sut = new UpdateExpenseUseCase(expensesRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should update fields when the executor is the payer', async () => {
		const payerId = new UniqueEntityId('payer-1')
		const u1 = new UniqueEntityId('user-1')
		const u2 = new UniqueEntityId('user-2')

		const expense = makeExpense({
			payerId,
			description: 'Old',
			split: {
				kind: 'equally',
				slices: [EqualSlice.create(u1), EqualSlice.create(u2)],
			},
		})

		expensesRepository.items.push(expense)

		vi.setSystemTime(new Date('2026-03-01T12:00:00.000Z'))
		const newCurrency = makeCurrency({ iso: 'EUR' })

		const { expense: updated } = await sut.execute({
			expenseId: expense.id.toString(),
			userId: 'payer-1',
			payerId: 'payer-2',
			description: 'New description',
			currency: newCurrency,
			totalAmountInCents: 200,
			date: new Date(),
			groupId: 'group-1',
			split: {
				kind: 'byPercentage',
				slices: [
					{ userId: 'a', percentage: 60 },
					{ userId: 'b', percentage: 40 },
				],
			},
		})

		expect(updated.payerId.toString()).toBe('payer-2')
		expect(updated.description).toBe('New description')
		expect(updated.totalAmountInCents).toBe(200)
		expect(updated.currency).toEqual(newCurrency)
		expect(updated.date).toEqual(new Date('2026-03-01T12:00:00.000Z'))
		expect(updated.groupId).toEqual(new UniqueEntityId('group-1'))
		expect(updated.split).toEqual({
			kind: 'byPercentage',
			slices: [
				PercentageSlice.create(new UniqueEntityId('a'), { percentage: 60 }),
				PercentageSlice.create(new UniqueEntityId('b'), { percentage: 40 }),
			],
		})

		const persisted = await expensesRepository.findById(expense.id.toString())

		expect(persisted).toEqual(updated)
	})

	it('should fail when the expense does not exist', async () => {
		await expect(
			sut.execute({
				expenseId: 'missing',
				payerId: 'payer-1',
				currency: makeCurrency(),
				totalAmountInCents: 100,
				date: new Date(),
				split: {
					kind: 'equally',
					slices: [{ userId: 'a' }, { userId: 'b' }],
				},
				userId: 'payer-1',
				description: 'X',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should fail when the executor is not the payer', async () => {
		const payerId = new UniqueEntityId('payer-1')
		const expense = makeExpense({ payerId })

		await expensesRepository.create(expense)

		await expect(
			sut.execute({
				expenseId: expense.id.toString(),
				userId: 'someone-else',
				payerId: 'payer-1',
				currency: makeCurrency(),
				totalAmountInCents: 100,
				date: new Date(),
				split: {
					kind: 'equally',
					slices: [{ userId: 'a' }, { userId: 'b' }],
				},
				description: 'Hacked',
			})
		).rejects.toBeInstanceOf(NotAllowedError)
	})
})
