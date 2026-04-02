import type { Payment } from '@/domain/tabs/enterprise/entities/payment'

export function toHttpPaymentSerializer(payment: Payment) {
	return {
		id: payment.id.toString(),
		payerId: payment.payerId.toString(),
		receiverId: payment.receiverId.toString(),
		amountInCents: payment.amountInCents,
		currency: payment.currency.iso,
		date: payment.date,
		groupId: payment.groupId?.toString() ?? null,
		createdAt: payment.createdAt,
		updatedAt: payment.updatedAt ?? null,
	}
}
