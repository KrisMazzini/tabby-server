import type { Prisma } from 'generated/prisma/client'
import type { PaginationParams } from '@/core/pagination/pagination'
import type {
	ExpensesListFilters,
	ExpensesRepository,
} from '@/domain/tabs/application/repositories/expenses-repository'
import type { Expense } from '@/domain/tabs/enterprise/entities/expense'
import { prisma } from '@/lib/prisma'
import {
	toDomainExpense,
	toPrismaExpense,
} from '../mappers/prisma-expense-mapper'

export class PrismaExpensesRepository implements ExpensesRepository {
	async create(expense: Expense) {
		const { expense: prismaExpense, slices: prismaSlices } =
			toPrismaExpense(expense)

		await prisma.$transaction(async tx => {
			await tx.expense.create({
				data: prismaExpense,
			})

			if (prismaSlices.length > 0) {
				await tx.expenseSlice.createMany({
					data: prismaSlices,
				})
			}
		})
	}

	async save(expense: Expense) {
		const { expense: prismaExpense, slices: prismaSlices } =
			toPrismaExpense(expense)

		await prisma.$transaction(async tx => {
			await tx.expense.update({
				where: { id: prismaExpense.id },
				data: prismaExpense,
			})

			await tx.expenseSlice.deleteMany({
				where: { expenseId: prismaExpense.id },
			})

			if (prismaSlices.length > 0) {
				await tx.expenseSlice.createMany({
					data: prismaSlices,
				})
			}
		})
	}

	async delete(expense: Expense) {
		await prisma.expense.delete({
			where: { id: expense.id.toString() },
		})
	}

	async findById(id: string) {
		const row = await prisma.expense.findUnique({
			where: { id },
			include: {
				slices: true,
			},
		})

		if (!row) {
			return null
		}

		const { slices, ...expense } = row

		return toDomainExpense(expense, slices)
	}

	async findManyByUserId(
		userId: string,
		pagination: PaginationParams,
		filters?: ExpensesListFilters
	) {
		const andFilters: Prisma.ExpenseWhereInput[] = [buildUserFilter(userId)]

		if (filters?.groupId) {
			andFilters.push({ groupId: filters.groupId })
		}

		if (filters?.friendId) {
			andFilters.push(buildUserFilter(filters.friendId))
		}

		const where: Prisma.ExpenseWhereInput = {
			AND: andFilters,
		}

		const rows = await prisma.expense.findMany({
			where,
			include: {
				slices: true,
			},
			orderBy: { date: 'desc' },
			take: pagination.size,
			skip: (pagination.page - 1) * pagination.size,
		})

		const totalItems = await prisma.expense.count({ where })

		const expenses = rows.map(row => {
			const { slices, ...expense } = row
			return toDomainExpense(expense, slices)
		})

		return {
			items: expenses,
			meta: {
				page: pagination.page,
				size: pagination.size,
				itemCount: expenses.length,
				totalItems,
				totalPages:
					pagination.size === 0 ? 0 : Math.ceil(totalItems / pagination.size),
			},
		}
	}
}

function buildUserFilter(userId: string): Prisma.ExpenseWhereInput {
	return {
		OR: [{ payerId: userId }, { slices: { some: { userId } } }],
	}
}
