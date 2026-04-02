import { DeletePaymentUseCase } from '@/domain/tabs/application/use-cases/delete-payment-use-case'
import { PrismaPaymentsRepository } from '@/infra/database/prisma/repositories/prisma-payments-repository'

export function makeDeletePaymentUseCase() {
	const paymentsRepository = new PrismaPaymentsRepository()
	return new DeletePaymentUseCase(paymentsRepository)
}
