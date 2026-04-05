import { ListExpensesUseCase } from '@/domain/tabs/application/use-cases/list-expenses-use-case'
import { PrismaExpensesRepository } from '@/infra/database/prisma/repositories/prisma-expenses-repository'

export function makeListExpensesUseCase() {
	const expensesRepository = new PrismaExpensesRepository()
	return new ListExpensesUseCase(expensesRepository)
}
