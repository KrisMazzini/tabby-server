import { DeleteExpenseUseCase } from '@/domain/tabs/application/use-cases/delete-expense-use-case'
import { PrismaExpensesRepository } from '@/infra/database/prisma/repositories/prisma-expenses-repository'

export function makeDeleteExpenseUseCase() {
	const expensesRepository = new PrismaExpensesRepository()
	return new DeleteExpenseUseCase(expensesRepository)
}
