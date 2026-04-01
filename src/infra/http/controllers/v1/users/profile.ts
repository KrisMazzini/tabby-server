import type { FastifyReply, FastifyRequest } from 'fastify'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeGetUserProfileUseCase } from '@/infra/factories/iam/make-get-user-profile-use-case'
import { toHttpUserSerializer } from '@/infra/http/serializers/user-serializer'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	try {
		const getUserProfileUseCase = makeGetUserProfileUseCase()

		const { user } = await getUserProfileUseCase.execute({
			id: request.user.sub,
		})

		return reply.status(200).send({
			user: toHttpUserSerializer(user),
		})
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		throw error
	}
}
