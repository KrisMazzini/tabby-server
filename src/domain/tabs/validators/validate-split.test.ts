import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import {
	EqualSlice,
	FixedSlice,
	PercentageSlice,
	SharesSlice,
	type Split,
} from '../enterprise/value-objects/slice'
import { DuplicateUserInSplitError } from '../errors/duplicate-user-in-split-error'
import { EmptySplitSlicesError } from '../errors/empty-split-slices-error'
import { FixedSplitTotalMismatchError } from '../errors/fixed-split-total-mismatch-error'
import { InvalidAmountError } from '../errors/invalid-amount-error'
import { PercentageSplitSumError } from '../errors/percentage-split-sum-error'
import { SharesSplitError } from '../errors/shares-split-error'
import { validateSplit } from './validate-split'

const user1 = new UniqueEntityId('user-1')
const user2 = new UniqueEntityId('user-2')

describe('Tabs | Validator: validateSplit', () => {
	describe('Total amount validation', () => {
		it('should validate a split with total amount greater than 0', () => {
			const split: Split = {
				kind: 'equally',
				slices: [EqualSlice.create(user1), EqualSlice.create(user2)],
			}

			expect(() => validateSplit(100, split)).not.toThrow()
		})

		it('should reject a split with total amount less than or equal to 0', () => {
			const split: Split = {
				kind: 'equally',
				slices: [EqualSlice.create(user1), EqualSlice.create(user2)],
			}

			expect(() => validateSplit(0, split)).toThrow(InvalidAmountError)
			expect(() => validateSplit(-1, split)).toThrow(InvalidAmountError)
		})
	})

	describe('Slices validation', () => {
		it('should reject a split with empty slices', () => {
			const split: Split = {
				kind: 'equally',
				slices: [],
			}

			expect(() => validateSplit(100, split)).toThrow(EmptySplitSlicesError)
		})

		it('should reject a split with duplicate user ids', () => {
			const split: Split = {
				kind: 'equally',
				slices: [EqualSlice.create(user1), EqualSlice.create(user1)],
			}

			expect(() => validateSplit(100, split)).toThrow(DuplicateUserInSplitError)
		})

		describe('Equal split validation', () => {
			it('should validate a split with equal slices', () => {
				const split: Split = {
					kind: 'equally',
					slices: [EqualSlice.create(user1), EqualSlice.create(user2)],
				}

				expect(() => validateSplit(100, split)).not.toThrow()
			})
		})

		describe('Percentage split validation', () => {
			it('should validate a split with percentage slices', () => {
				const split: Split = {
					kind: 'byPercentage',
					slices: [
						PercentageSlice.create(user1, {
							percentage: 70,
						}),
						PercentageSlice.create(user2, {
							percentage: 30,
						}),
					],
				}

				expect(() => validateSplit(100, split)).not.toThrow()
			})

			it('should reject a split with percentage slices when sum is not 100', () => {
				const split: Split = {
					kind: 'byPercentage',
					slices: [PercentageSlice.create(user1, { percentage: 70 })],
				}

				expect(() => validateSplit(100, split)).toThrow(PercentageSplitSumError)
			})
		})

		describe('Shares split validation', () => {
			it('should validate a split with shares slices', () => {
				const split: Split = {
					kind: 'byShares',
					slices: [
						SharesSlice.create(user1, { shares: 1 }),
						SharesSlice.create(user2, { shares: 3 }),
					],
				}

				expect(() => validateSplit(100, split)).not.toThrow()
			})

			it('should reject a split with shares slices when sum is not greater than 0', () => {
				const split: Split = {
					kind: 'byShares',
					slices: [SharesSlice.create(user1, { shares: 0 })],
				}

				expect(() => validateSplit(100, split)).toThrow(SharesSplitError)
			})
		})

		describe('Fixed amounts split validation', () => {
			it('should validate a split with fixed amounts slices', () => {
				const split: Split = {
					kind: 'byFixedAmounts',
					slices: [
						FixedSlice.create(user1, { amountInCents: 10 }),
						FixedSlice.create(user2, { amountInCents: 20 }),
					],
				}

				expect(() => validateSplit(30, split)).not.toThrow()
			})

			it('should reject a split with fixed amounts slices when sum is not equal to total amount', () => {
				const split: Split = {
					kind: 'byFixedAmounts',
					slices: [FixedSlice.create(user1, { amountInCents: 10 })],
				}

				expect(() => validateSplit(30, split)).toThrow(
					FixedSplitTotalMismatchError
				)
			})
		})
	})
})
