import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import {
	EqualSlice,
	FixedSlice,
	PercentageSlice,
	SharesSlice,
} from '../../enterprise/value-objects/slice'

import { toExpenseSplit } from './expense-split-mapper'

describe('Tabs | Mapper: expense-split', () => {
	describe('equally', () => {
		it('maps equal slices', () => {
			const result = toExpenseSplit({
				kind: 'equally',
				slices: [{ userId: 'user-a' }, { userId: 'user-b' }],
			})

			expect(result).toEqual({
				kind: 'equally',
				slices: [
					EqualSlice.create(new UniqueEntityId('user-a')),
					EqualSlice.create(new UniqueEntityId('user-b')),
				],
			})
		})
	})

	describe('byPercentage', () => {
		it('maps slices with percentages', () => {
			const result = toExpenseSplit({
				kind: 'byPercentage',
				slices: [
					{ userId: 'u1', percentage: 60 },
					{ userId: 'u2', percentage: 40 },
				],
			})

			expect(result).toEqual({
				kind: 'byPercentage',
				slices: [
					PercentageSlice.create(new UniqueEntityId('u1'), {
						percentage: 60,
					}),
					PercentageSlice.create(new UniqueEntityId('u2'), {
						percentage: 40,
					}),
				],
			})
		})
	})

	describe('byShares', () => {
		it('maps slices with share counts', () => {
			const result = toExpenseSplit({
				kind: 'byShares',
				slices: [
					{ userId: 'u1', shares: 2 },
					{ userId: 'u2', shares: 3 },
				],
			})

			expect(result).toEqual({
				kind: 'byShares',
				slices: [
					SharesSlice.create(new UniqueEntityId('u1'), { shares: 2 }),
					SharesSlice.create(new UniqueEntityId('u2'), { shares: 3 }),
				],
			})
		})
	})

	describe('byFixedAmounts', () => {
		it('maps slices with amounts in cents', () => {
			const result = toExpenseSplit({
				kind: 'byFixedAmounts',
				slices: [
					{ userId: 'u1', amountInCents: 3000 },
					{ userId: 'u2', amountInCents: 7000 },
				],
			})

			expect(result).toEqual({
				kind: 'byFixedAmounts',
				slices: [
					FixedSlice.create(new UniqueEntityId('u1'), {
						amountInCents: 3000,
					}),
					FixedSlice.create(new UniqueEntityId('u2'), {
						amountInCents: 7000,
					}),
				],
			})
		})
	})
})
