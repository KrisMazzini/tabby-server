import type { Payment as PrismaPayment } from 'generated/prisma/client'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { Payment } from '@/domain/tabs/enterprise/entities/payment'
import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'

export function toDomainPayment(row: PrismaPayment): Payment {
	return Payment.create(
		{
			payerId: new UniqueEntityId(row.payerId),
			receiverId: new UniqueEntityId(row.receiverId),
			amountInCents: row.amountInCents,
			currency: Currency.create({ iso: row.currencyIso }),
			date: row.date,
			groupId: row.groupId ? new UniqueEntityId(row.groupId) : undefined,
		},
		{
			id: new UniqueEntityId(row.id),
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,
		}
	)
}

export function toPrismaPayment(payment: Payment): PrismaPayment {
	return {
		id: payment.id.toString(),
		payerId: payment.payerId.toString(),
		receiverId: payment.receiverId.toString(),
		amountInCents: payment.amountInCents,
		currencyIso: payment.currency.iso,
		date: payment.date,
		groupId: payment.groupId?.toString() ?? null,
		createdAt: payment.createdAt,
		updatedAt: payment.updatedAt ?? null,
	}
}
