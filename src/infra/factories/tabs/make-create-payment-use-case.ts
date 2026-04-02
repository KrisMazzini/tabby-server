import { CreatePaymentUseCase } from '@/domain/tabs/application/use-cases/create-payment-use-case'
import { PrismaPaymentsRepository } from '@/infra/database/prisma/repositories/prisma-payments-repository'

export function makeCreatePaymentUseCase() {
	const paymentsRepository = new PrismaPaymentsRepository()
	return new CreatePaymentUseCase(paymentsRepository)
}
