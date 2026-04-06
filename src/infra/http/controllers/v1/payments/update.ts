import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'
import { makeUpdatePaymentUseCase } from '@/infra/factories/tabs/make-update-payment-use-case'
import { toHttpPaymentSerializer } from '@/infra/http/serializers/payment-serializer'

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const updatePaymentParamsSchema = z.object({
		paymentId: z.string(),
	})

	const updatePaymentBodySchema = z.object({
		amountInCents: z.number().int().positive(),
		currencyIso: z.string().min(3).max(3),
		date: z.iso.datetime().transform(date => new Date(date)),
		groupId: z.string().optional(),
	})

	const { paymentId } = updatePaymentParamsSchema.parse(request.params)

	const { amountInCents, currencyIso, date, groupId } =
		updatePaymentBodySchema.parse(request.body)

	const updatePaymentUseCase = makeUpdatePaymentUseCase()

	const { payment } = await updatePaymentUseCase.execute({
		paymentId,
		userId: request.user.sub,
		amountInCents,
		currency: Currency.create({ iso: currencyIso }),
		date,
		groupId,
	})

	return reply.status(200).send({
		payment: toHttpPaymentSerializer(payment),
	})
}
