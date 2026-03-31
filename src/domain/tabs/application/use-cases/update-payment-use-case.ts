import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { Payment } from '../../enterprise/entities/payment'
import type { Currency } from '../../enterprise/value-objects/currency'
import type { PaymentsRepository } from '../repositories/payments-repository'

export interface UpdatePaymentUseCaseRequest {
	paymentId: string
	userId: string
	amountInCents: number
	currency: Currency
	date: Date
	groupId?: string
}

export interface UpdatePaymentUseCaseResponse {
	payment: Payment
}

export class UpdatePaymentUseCase {
	constructor(private paymentsRepository: PaymentsRepository) {}

	async execute({
		paymentId,
		userId,
		amountInCents,
		currency,
		date,
		groupId,
	}: UpdatePaymentUseCaseRequest): Promise<UpdatePaymentUseCaseResponse> {
		const payment = await this.paymentsRepository.findById(paymentId)

		if (!payment) {
			throw new ResourceNotFoundError('Payment')
		}

		if (!payment.payerId.equals(new UniqueEntityId(userId))) {
			throw new NotAllowedError()
		}

		payment.amountInCents = amountInCents
		payment.currency = currency
		payment.date = date
		payment.groupId = groupId ? new UniqueEntityId(groupId) : undefined

		await this.paymentsRepository.save(payment)

		return { payment }
	}
}
