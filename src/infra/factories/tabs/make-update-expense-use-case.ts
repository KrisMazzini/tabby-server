import { UpdateExpenseUseCase } from '@/domain/tabs/application/use-cases/update-expense-use-case'
import { PrismaExpensesRepository } from '@/infra/database/prisma/repositories/prisma-expenses-repository'

export function makeUpdateExpenseUseCase() {
	const expensesRepository = new PrismaExpensesRepository()
	return new UpdateExpenseUseCase(expensesRepository)
}
