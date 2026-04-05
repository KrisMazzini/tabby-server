import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeDeleteExpenseUseCase } from '@/infra/factories/tabs/make-delete-expense-use-case'

export async function deleteExpense(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const deleteExpenseParamsSchema = z.object({
		expenseId: z.string(),
	})

	const { expenseId } = deleteExpenseParamsSchema.parse(request.params)

	const deleteExpenseUseCase = makeDeleteExpenseUseCase()

	await deleteExpenseUseCase.execute({
		expenseId,
		userId: request.user.sub,
	})

	return reply.status(204).send()
}
