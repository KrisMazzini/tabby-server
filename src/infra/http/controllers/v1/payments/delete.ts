import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeDeletePaymentUseCase } from '@/infra/factories/tabs/make-delete-payment-use-case'

export async function deletePayment(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const deletePaymentParamsSchema = z.object({
		paymentId: z.string(),
	})

	const { paymentId } = deletePaymentParamsSchema.parse(request.params)

	try {
		const deletePaymentUseCase = makeDeletePaymentUseCase()

		await deletePaymentUseCase.execute({
			paymentId,
			userId: request.user.sub,
		})
	} catch (error) {
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

	return reply.status(204).send()
}
