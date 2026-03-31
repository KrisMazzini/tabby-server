import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { Payment } from '../../enterprise/entities/payment'
import type { Currency } from '../../enterprise/value-objects/currency'
import type { PaymentsRepository } from '../repositories/payments-repository'

export interface CreatePaymentUseCaseRequest {
	payerId: string
	receiverId: string
	amountInCents: number
	currency: Currency
	date: Date
	groupId?: string
}

export interface CreatePaymentUseCaseResponse {
	payment: Payment
}

export class CreatePaymentUseCase {
	constructor(private paymentsRepository: PaymentsRepository) {}

	async execute({
		payerId,
		receiverId,
		amountInCents,
		currency,
		date,
		groupId,
	}: CreatePaymentUseCaseRequest): Promise<CreatePaymentUseCaseResponse> {
		const payment = Payment.create({
			payerId: new UniqueEntityId(payerId),
			receiverId: new UniqueEntityId(receiverId),
			amountInCents,
			currency,
			date,
			groupId: groupId ? new UniqueEntityId(groupId) : undefined,
		})

		await this.paymentsRepository.create(payment)

		return { payment }
	}
}
