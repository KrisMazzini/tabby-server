import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeDeleteGroupUseCase } from '@/infra/factories/tabs/make-delete-group-use-case'

export async function deleteGroup(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const paramsSchema = z.object({
		groupId: z.string(),
	})

	const { groupId } = paramsSchema.parse(request.params)

	try {
		const deleteGroupUseCase = makeDeleteGroupUseCase()

		await deleteGroupUseCase.execute({
			groupId,
			userId: request.user.sub,
		})

		return reply.status(204).send()
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
}
