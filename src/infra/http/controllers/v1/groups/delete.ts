import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeDeleteGroupUseCase } from '@/infra/factories/tabs/make-delete-group-use-case'

export async function deleteGroup(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const paramsSchema = z.object({
		groupId: z.string(),
	})

	const { groupId } = paramsSchema.parse(request.params)

	const deleteGroupUseCase = makeDeleteGroupUseCase()

	await deleteGroupUseCase.execute({
		groupId,
		userId: request.user.sub,
	})

	return reply.status(204).send()
}
