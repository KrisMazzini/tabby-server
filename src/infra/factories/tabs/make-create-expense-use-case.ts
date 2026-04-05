import { CreateExpenseUseCase } from '@/domain/tabs/application/use-cases/create-expense-use-case'
import { PrismaExpensesRepository } from '@/infra/database/prisma/repositories/prisma-expenses-repository'

export function makeCreateExpenseUseCase() {
	const expensesRepository = new PrismaExpensesRepository()
	return new CreateExpenseUseCase(expensesRepository)
}
