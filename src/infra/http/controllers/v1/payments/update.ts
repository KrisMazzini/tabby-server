import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'
import { InvalidAmountError } from '@/domain/tabs/errors/invalid-amount-error'
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

	try {
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
	} catch (error) {
		if (error instanceof InvalidAmountError) {
			return reply.status(400).send({
				message: error.message,
			})
		}

		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		if (error instanceof NotAllowedError) {
			return reply.status(403).send({
				message: error.message,
			})
		}

		throw error
	}
}
