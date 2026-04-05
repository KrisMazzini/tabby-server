import type {
	ExpenseSlice as PrismaExpenseSlice,
	ExpenseSplitKind as PrismaExpenseSplitKind,
} from 'generated/prisma/client'

import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import {
	EqualSlice,
	FixedSlice,
	PercentageSlice,
	SharesSlice,
	type Split,
} from '@/domain/tabs/enterprise/value-objects/slice'

export function toDomainExpenseSplit(
	kind: PrismaExpenseSplitKind,
	slices: PrismaExpenseSlice[]
): Split {
	if (kind === 'equally') {
		return {
			kind: 'equally',
			slices: slices.map(slice =>
				EqualSlice.create(new UniqueEntityId(slice.userId))
			),
		}
	}

	if (kind === 'byPercentage') {
		return {
			kind: 'byPercentage',
			slices: slices.map(slice =>
				PercentageSlice.create(new UniqueEntityId(slice.userId), {
					percentage: slice.percentage ?? 0,
				})
			),
		}
	}

	if (kind === 'byShares') {
		return {
			kind: 'byShares',
			slices: slices.map(slice =>
				SharesSlice.create(new UniqueEntityId(slice.userId), {
					shares: slice.shares ?? 0,
				})
			),
		}
	}

	return {
		kind: 'byFixedAmounts',
		slices: slices.map(slice =>
			FixedSlice.create(new UniqueEntityId(slice.userId), {
				amountInCents: slice.amountInCents ?? 0,
			})
		),
	}
}

export function toPrismaExpenseSlices(
	expenseId: UniqueEntityId,
	split: Split
): PrismaExpenseSlice[] {
	const { slices } = split

	return slices.map(slice => {
		const amountInCents =
			slice instanceof FixedSlice ? slice.amountInCents : null
		const percentage =
			slice instanceof PercentageSlice ? slice.percentage : null
		const shares = slice instanceof SharesSlice ? slice.shares : null

		return {
			expenseId: expenseId.toString(),
			userId: slice.userId.toString(),
			amountInCents: amountInCents,
			percentage: percentage,
			shares: shares,
		}
	})
}
