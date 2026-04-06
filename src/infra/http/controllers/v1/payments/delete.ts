import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeletePaymentUseCase } from '@/infra/factories/tabs/make-delete-payment-use-case'

export async function deletePayment(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const deletePaymentParamsSchema = z.object({
		paymentId: z.string(),
	})

	const { paymentId } = deletePaymentParamsSchema.parse(request.params)

	const deletePaymentUseCase = makeDeletePaymentUseCase()

	await deletePaymentUseCase.execute({
		paymentId,
		userId: request.user.sub,
	})

	return reply.status(204).send()
}
