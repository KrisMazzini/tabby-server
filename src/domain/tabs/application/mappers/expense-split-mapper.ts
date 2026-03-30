import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import {
	EqualSlice,
	FixedSlice,
	PercentageSlice,
	SharesSlice,
	type Split,
} from '../../enterprise/value-objects/slice'

export type EquallySplitRaw = { kind: 'equally'; slices: { userId: string }[] }
export type ByPercentageSplitRaw = {
	kind: 'byPercentage'
	slices: { userId: string; percentage: number }[]
}
export type BySharesSplitRaw = {
	kind: 'byShares'
	slices: { userId: string; shares: number }[]
}
export type ByFixedAmountsSplitRaw = {
	kind: 'byFixedAmounts'
	slices: { userId: string; amountInCents: number }[]
}
export type ExpenseSplitRaw =
	| EquallySplitRaw
	| ByPercentageSplitRaw
	| BySharesSplitRaw
	| ByFixedAmountsSplitRaw

export function toExpenseSplit(input: ExpenseSplitRaw): Split {
	switch (input.kind) {
		case 'equally':
			return {
				kind: 'equally',
				slices: input.slices.map(slice =>
					EqualSlice.create(new UniqueEntityId(slice.userId))
				),
			}

		case 'byPercentage':
			return {
				kind: 'byPercentage',
				slices: input.slices.map(slice =>
					PercentageSlice.create(new UniqueEntityId(slice.userId), {
						percentage: slice.percentage,
					})
				),
			}

		case 'byShares':
			return {
				kind: 'byShares',
				slices: input.slices.map(slice =>
					SharesSlice.create(new UniqueEntityId(slice.userId), {
						shares: slice.shares,
					})
				),
			}

		case 'byFixedAmounts':
			return {
				kind: 'byFixedAmounts',
				slices: input.slices.map(slice =>
					FixedSlice.create(new UniqueEntityId(slice.userId), {
						amountInCents: slice.amountInCents,
					})
				),
			}
	}
}
