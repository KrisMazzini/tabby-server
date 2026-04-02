import { UpdatePaymentUseCase } from '@/domain/tabs/application/use-cases/update-payment-use-case'
import { PrismaPaymentsRepository } from '@/infra/database/prisma/repositories/prisma-payments-repository'

export function makeUpdatePaymentUseCase() {
	const paymentsRepository = new PrismaPaymentsRepository()
	return new UpdatePaymentUseCase(paymentsRepository)
}
