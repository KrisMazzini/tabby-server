import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { Currency } from '../value-objects/currency'
import { EqualSlice, PercentageSlice } from '../value-objects/slice'

import { Expense } from './expense'

const validateSplit = vi.hoisted(() => vi.fn())

vi.mock('../../validators/validate-split', () => {
	return {
		validateSplit,
	}
})

const payerId = new UniqueEntityId('payer-1')
const currency = Currency.create({
	name: 'Brazilian Real',
	symbol: 'R$',
	iso: 'BRL',
})
const u1 = new UniqueEntityId('user-1')
const u2 = new UniqueEntityId('user-2')

describe('Tabs | Entity: Expense', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create an expense', () => {
		vi.setSystemTime(new Date('2026-03-28'))

		const expense = Expense.create({
			payerId,
			description: 'Test expense',
			totalAmountInCents: 100,
			currency,
			date: new Date(),
			split: {
				kind: 'equally',
				slices: [EqualSlice.create(u1), EqualSlice.create(u2)],
			},
		})

		expect(validateSplit).toHaveBeenCalledWith(100, {
			kind: 'equally',
			slices: [EqualSlice.create(u1), EqualSlice.create(u2)],
		})

		expect(expense.payerId).toBe(payerId)
		expect(expense.description).toBe('Test expense')
		expect(expense.totalAmountInCents).toBe(100)
		expect(expense.currency).toBe(currency)
		expect(expense.date).toEqual(new Date('2026-03-28'))
		expect(expense.groupId).toBeUndefined()
		expect(expense.split).toEqual({
			kind: 'equally',
			slices: [EqualSlice.create(u1), EqualSlice.create(u2)],
		})
	})

	it('should should be possible to redistribute an expense', () => {
		const expense = Expense.create({
			payerId,
			description: 'Test expense',
			totalAmountInCents: 100,
			currency,
			date: new Date(),
			split: {
				kind: 'equally',
				slices: [EqualSlice.create(u1), EqualSlice.create(u2)],
			},
		})

		expense.redistribute(200, {
			kind: 'byPercentage',
			slices: [
				PercentageSlice.create(u1, { percentage: 30 }),
				PercentageSlice.create(u2, { percentage: 70 }),
			],
		})

		expect(validateSplit).toHaveBeenCalledWith(200, {
			kind: 'byPercentage',
			slices: [
				PercentageSlice.create(u1, { percentage: 30 }),
				PercentageSlice.create(u2, { percentage: 70 }),
			],
		})

		expect(expense.totalAmountInCents).toBe(200)
		expect(expense.split).toEqual({
			kind: 'byPercentage',
			slices: [
				PercentageSlice.create(u1, { percentage: 30 }),
				PercentageSlice.create(u2, { percentage: 70 }),
			],
		})
	})

	it('should be possible to update the expense', () => {
		const before = new Date('2026-03-28')
		vi.setSystemTime(before)

		const expense = Expense.create({
			payerId,
			description: 'Expense',
			totalAmountInCents: 100,
			currency,
			date: new Date(),
			split: {
				kind: 'equally',
				slices: [EqualSlice.create(u1), EqualSlice.create(u2)],
			},
		})

		const after = new Date('2026-01-01')
		vi.setSystemTime(after)

		expense.groupId = new UniqueEntityId('group-1')
		expense.date = new Date('2026-01-01')
		expense.description = 'New description'
		expense.currency = Currency.create({
			name: 'Euro',
			symbol: '€',
			iso: 'EUR',
		})

		expect(expense.description).toBe('New description')
		expect(expense.date).toEqual(new Date('2026-01-01'))
		expect(expense.groupId).toEqual(new UniqueEntityId('group-1'))
		expect(expense.currency).toEqual(
			Currency.create({
				name: 'Euro',
				symbol: '€',
				iso: 'EUR',
			})
		)
	})
})
