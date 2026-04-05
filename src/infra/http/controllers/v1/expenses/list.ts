import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeListExpensesUseCase } from '@/infra/factories/tabs/make-list-expenses-use-case'
import { toHttpExpenseSerializer } from '@/infra/http/serializers/expense-serializer'

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const listExpensesQuerySchema = z.object({
		page: z.coerce.number().int().positive().optional(),
		size: z.coerce.number().int().positive().optional(),
		groupId: z.string().optional(),
		friendId: z.string().optional(),
	})

	const { page, size, groupId, friendId } = listExpensesQuerySchema.parse(
		request.query
	)

	const listExpensesUseCase = makeListExpensesUseCase()

	const { expenses, meta } = await listExpensesUseCase.execute({
		userId: request.user.sub,
		page,
		size,
		filters: {
			groupId,
			friendId,
		},
	})

	return reply.status(200).send({
		expenses: expenses.map(toHttpExpenseSerializer),
		meta,
	})
}
