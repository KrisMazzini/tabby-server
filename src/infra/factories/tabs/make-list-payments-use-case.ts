import { ListPaymentsUseCase } from '@/domain/tabs/application/use-cases/list-payments-use-case'
import { PrismaPaymentsRepository } from '@/infra/database/prisma/repositories/prisma-payments-repository'

export function makeListPaymentsUseCase() {
	const paymentsRepository = new PrismaPaymentsRepository()
	return new ListPaymentsUseCase(paymentsRepository)
}
