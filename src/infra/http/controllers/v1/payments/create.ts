import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'
import { makeCreatePaymentUseCase } from '@/infra/factories/tabs/make-create-payment-use-case'
import { toHttpPaymentSerializer } from '@/infra/http/serializers/payment-serializer'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createPaymentBodySchema = z.object({
		receiverId: z.string(),
		amountInCents: z.number().int().positive(),
		currencyIso: z.string().min(3).max(3),
		date: z.iso.datetime().transform(date => new Date(date)),
		groupId: z.string().optional(),
	})

	const { receiverId, amountInCents, currencyIso, date, groupId } =
		createPaymentBodySchema.parse(request.body)

	const createPaymentUseCase = makeCreatePaymentUseCase()

	const { payment } = await createPaymentUseCase.execute({
		payerId: request.user.sub,
		receiverId,
		amountInCents,
		currency: Currency.create({ iso: currencyIso }),
		date,
		groupId,
	})

	return reply.status(201).send({
		payment: toHttpPaymentSerializer(payment),
	})
}
