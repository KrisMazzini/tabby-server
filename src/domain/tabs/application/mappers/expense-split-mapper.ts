import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import {
	EqualSlice,
	FixedSlice,
	PercentageSlice,
	SharesSlice,
	type Split,
} from '../../enterprise/value-objects/slice'

export type ExpenseSplitRaw = {
	kind: 'equally' | 'byPercentage' | 'byShares' | 'byFixedAmounts'
	slices: {
		userId: string
		amountInCents?: number
		percentage?: number
		shares?: number
	}[]
}

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
						percentage: slice.percentage ?? 0,
					})
				),
			}

		case 'byShares':
			return {
				kind: 'byShares',
				slices: input.slices.map(slice =>
					SharesSlice.create(new UniqueEntityId(slice.userId), {
						shares: slice.shares ?? 0,
					})
				),
			}

		case 'byFixedAmounts':
			return {
				kind: 'byFixedAmounts',
				slices: input.slices.map(slice =>
					FixedSlice.create(new UniqueEntityId(slice.userId), {
						amountInCents: slice.amountInCents ?? 0,
					})
				),
			}
	}
}
