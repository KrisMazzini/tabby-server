import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeListPaymentsUseCase } from '@/infra/factories/tabs/make-list-payments-use-case'
import { toHttpPaymentSerializer } from '@/infra/http/serializers/payment-serializer'

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const listPaymentsQuerySchema = z.object({
		page: z.number().int().positive().optional(),
		size: z.number().int().positive().optional(),
		role: z.enum(['payer', 'receiver']).optional(),
		friendId: z.string().optional(),
		groupId: z.string().optional(),
	})

	const { page, size, role, friendId, groupId } = listPaymentsQuerySchema.parse(
		request.query
	)

	const listPaymentsUseCase = makeListPaymentsUseCase()
	const { payments, meta } = await listPaymentsUseCase.execute({
		userId: request.user.sub,
		page: page,
		size: size,
		filters: {
			role: role,
			friendId: friendId,
			groupId: groupId,
		},
	})

	return reply.status(200).send({
		payments: payments.map(toHttpPaymentSerializer),
		meta,
	})
}
