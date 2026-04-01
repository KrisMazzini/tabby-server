import type { FastifyReply, FastifyRequest } from 'fastify'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeDeleteUserUseCase } from '@/infra/factories/iam/make-delete-user-use-case'

export async function deleteAccount(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const deleteUserUseCase = makeDeleteUserUseCase()

		await deleteUserUseCase.execute({
			id: request.user.sub,
		})

		return reply.clearCookie('refreshToken').status(200).send()
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		throw error
	}
}
