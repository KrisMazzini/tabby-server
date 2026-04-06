import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeCreateFriendshipUseCase } from '@/infra/factories/tabs/make-create-friendship-use-case'
import { toHttpFriendshipSerializer } from '@/infra/http/serializers/friendship-serializer'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createFriendshipBodySchema = z.object({
		toUserId: z.string(),
	})

	const { toUserId } = createFriendshipBodySchema.parse(request.body)

	const createFriendshipUseCase = makeCreateFriendshipUseCase()

	const { friendship } = await createFriendshipUseCase.execute({
		fromUserId: request.user.sub,
		toUserId: toUserId,
	})

	return reply.status(201).send({
		friendship: toHttpFriendshipSerializer(friendship),
	})
}
