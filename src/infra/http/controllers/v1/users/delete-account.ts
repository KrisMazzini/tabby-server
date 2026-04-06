import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeDeleteUserUseCase } from '@/infra/factories/iam/make-delete-user-use-case'

export async function deleteAccount(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const deleteUserUseCase = makeDeleteUserUseCase()

	await deleteUserUseCase.execute({
		id: request.user.sub,
	})

	return reply.clearCookie('refreshToken').status(200).send()
}
