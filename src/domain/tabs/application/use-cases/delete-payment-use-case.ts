import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { PaymentsRepository } from '../repositories/payments-repository'

export interface DeletePaymentUseCaseRequest {
	paymentId: string
	userId: string
}

export class DeletePaymentUseCase {
	constructor(private paymentsRepository: PaymentsRepository) {}

	async execute({
		paymentId,
		userId,
	}: DeletePaymentUseCaseRequest): Promise<void> {
		const payment = await this.paymentsRepository.findById(paymentId)

		if (!payment) {
			throw new ResourceNotFoundError('Payment')
		}

		if (!payment.payerId.equals(new UniqueEntityId(userId))) {
			throw new NotAllowedError()
		}

		await this.paymentsRepository.delete(payment)
	}
}
