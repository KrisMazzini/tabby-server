import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeAcceptFriendshipUseCase } from '@/infra/factories/tabs/make-accept-friendship-use-case'
import { toHttpFriendshipSerializer } from '@/infra/http/serializers/friendship-serializer'

export async function accept(request: FastifyRequest, reply: FastifyReply) {
	const acceptFriendshipParamsSchema = z.object({
		friendshipId: z.string(),
	})

	const { friendshipId } = acceptFriendshipParamsSchema.parse(request.params)

	const acceptFriendshipUseCase = makeAcceptFriendshipUseCase()

	const { friendship } = await acceptFriendshipUseCase.execute({
		friendshipId,
		userId: request.user.sub,
	})

	return reply.status(200).send({
		friendship: toHttpFriendshipSerializer(friendship),
	})
}
