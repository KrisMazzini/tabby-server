import { faker } from '@faker-js/faker'
import type { EntityArgs } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Payment, type PaymentProps } from '../../enterprise/entities/payment'
import { makeCurrency } from './make-currency'

export function makePayment(
	override: Partial<PaymentProps> = {},
	args?: EntityArgs
) {
	return Payment.create(
		{
			payerId: new UniqueEntityId(),
			receiverId: new UniqueEntityId(),
			amountInCents: faker.number.int({ min: 100, max: 100_000 }),
			currency: makeCurrency(),
			date: new Date(),
			...override,
		},
		args
	)
}
