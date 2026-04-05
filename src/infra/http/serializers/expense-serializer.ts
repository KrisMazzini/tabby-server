import type { Expense } from '@/domain/tabs/enterprise/entities/expense'
import {
	EqualSlice,
	PercentageSlice,
	SharesSlice,
	type Split,
} from '@/domain/tabs/enterprise/value-objects/slice'

export function toHttpExpenseSerializer(expense: Expense) {
	return {
		id: expense.id.toString(),
		payerId: expense.payerId.toString(),
		description: expense.description,
		currencyIso: expense.currency.iso,
		totalAmountInCents: expense.totalAmountInCents,
		date: expense.date,
		groupId: expense.groupId?.toString() ?? null,
		split: toHttpExpenseSplitSerializer(expense.split),
		createdAt: expense.createdAt,
		updatedAt: expense.updatedAt ?? null,
	}
}

function toHttpExpenseSplitSerializer(split: Split) {
	const slices = split.slices.map(slice => {
		if (slice instanceof EqualSlice) {
			return {
				userId: slice.userId.toString(),
			}
		}

		if (slice instanceof PercentageSlice) {
			return {
				userId: slice.userId.toString(),
				percentage: slice.percentage,
			}
		}

		if (slice instanceof SharesSlice) {
			return {
				userId: slice.userId.toString(),
				shares: slice.shares,
			}
		}

		return {
			userId: slice.userId.toString(),
			amountInCents: slice.amountInCents,
		}
	})

	return {
		kind: split.kind,
		slices,
	}
}
