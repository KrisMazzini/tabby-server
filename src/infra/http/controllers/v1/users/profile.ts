import type { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserProfileUseCase } from '@/infra/factories/iam/make-get-user-profile-use-case'
import { toHttpUserSerializer } from '@/infra/http/serializers/user-serializer'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	const getUserProfileUseCase = makeGetUserProfileUseCase()

	const { user } = await getUserProfileUseCase.execute({
		id: request.user.sub,
	})

	return reply.status(200).send({
		user: toHttpUserSerializer(user),
	})
}
