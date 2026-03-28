import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { InvalidFixedSliceError } from '../../errors/invalid-fixed-slice-error'
import { InvalidPercentageSliceError } from '../../errors/invalid-percentage-slice-error'
import { InvalidSharesSliceError } from '../../errors/invalid-shares-slice-error'

import { EqualSlice, FixedSlice, PercentageSlice, SharesSlice } from './slice'

describe('Tabs | Value Object: Slice', () => {
	describe('EqualSlice', () => {
		it('should create an equal slice', () => {
			const slice = EqualSlice.create(new UniqueEntityId('user-1'))
			expect(slice.userId.toString()).toBe('user-1')
		})
	})

	describe('PercentageSlice', () => {
		it('should create a percentage slice', () => {
			const slice = PercentageSlice.create(new UniqueEntityId('user-1'), {
				percentage: 50,
			})
			expect(slice.userId.toString()).toBe('user-1')
			expect(slice.percentage).toBe(50)
		})

		it('should reject a percentage slice when percentage is not between 0 and 100', () => {
			expect(() =>
				PercentageSlice.create(new UniqueEntityId('user-1'), {
					percentage: 101,
				})
			).toThrow(InvalidPercentageSliceError)

			expect(() =>
				PercentageSlice.create(new UniqueEntityId('user-1'), {
					percentage: -1,
				})
			).toThrow(InvalidPercentageSliceError)
		})
	})

	describe('SharesSlice', () => {
		it('should create a shares slice', () => {
			const slice = SharesSlice.create(new UniqueEntityId('user-1'), {
				shares: 2,
			})
			expect(slice.userId.toString()).toBe('user-1')
			expect(slice.shares).toBe(2)
		})

		it('should reject a shares slice when shares is not lower than 0', () => {
			expect(() =>
				SharesSlice.create(new UniqueEntityId('user-1'), {
					shares: -1,
				})
			).toThrow(InvalidSharesSliceError)
		})
	})

	describe('FixedSlice', () => {
		it('should create a fixed slice', () => {
			const slice = FixedSlice.create(new UniqueEntityId('user-1'), {
				amountInCents: 100,
			})

			expect(slice.userId.toString()).toBe('user-1')
			expect(slice.amountInCents).toBe(100)
		})

		it('should reject a fixed slice when amount in cents is not lower than 0', () => {
			expect(() =>
				FixedSlice.create(new UniqueEntityId('user-1'), {
					amountInCents: -1,
				})
			).toThrow(InvalidFixedSliceError)
		})
	})
})
