import type {
	Expense as PrismaExpense,
	ExpenseSlice as PrismaExpenseSlice,
} from 'generated/prisma/client'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Expense } from '@/domain/tabs/enterprise/entities/expense'
import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'

import {
	toDomainExpenseSplit,
	toPrismaExpenseSlices,
} from './prisma-expense-split-mapper'

export function toDomainExpense(
	expenseRow: PrismaExpense,
	sliceRows: PrismaExpenseSlice[]
): Expense {
	return Expense.create(
		{
			payerId: new UniqueEntityId(expenseRow.payerId),
			currency: Currency.create({ iso: expenseRow.currencyIso }),
			description: expenseRow.description,
			totalAmountInCents: expenseRow.totalAmountInCents,
			date: expenseRow.date,
			groupId: expenseRow.groupId
				? new UniqueEntityId(expenseRow.groupId)
				: undefined,
			split: toDomainExpenseSplit(expenseRow.splitKind, sliceRows),
		},
		{
			id: new UniqueEntityId(expenseRow.id),
			createdAt: expenseRow.createdAt,
			updatedAt: expenseRow.updatedAt ?? undefined,
		}
	)
}

export function toPrismaExpense(expense: Expense): {
	expense: PrismaExpense
	slices: PrismaExpenseSlice[]
} {
	return {
		expense: {
			id: expense.id.toString(),
			payerId: expense.payerId.toString(),
			description: expense.description,
			currencyIso: expense.currency.iso,
			totalAmountInCents: expense.totalAmountInCents,
			date: expense.date,
			groupId: expense.groupId?.toString() ?? null,
			splitKind: expense.split.kind,
			createdAt: expense.createdAt,
			updatedAt: expense.updatedAt ?? null,
		},
		slices: toPrismaExpenseSlices(expense.id, expense.split),
	}
}
