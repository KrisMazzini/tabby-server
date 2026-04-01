import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FriendshipNotPendingError } from '@/domain/tabs/errors/friendship-not-pending-error'
import { makeAcceptFriendshipUseCase } from '@/infra/factories/tabs/make-accept-friendship-use-case'
import { toHttpFriendshipSerializer } from '@/infra/http/serializers/friendship-serializer'

export async function accept(request: FastifyRequest, reply: FastifyReply) {
	const acceptFriendshipParamsSchema = z.object({
		friendshipId: z.string(),
	})

	const { friendshipId } = acceptFriendshipParamsSchema.parse(request.params)

	try {
		const acceptFriendshipUseCase = makeAcceptFriendshipUseCase()

		const { friendship } = await acceptFriendshipUseCase.execute({
			friendshipId,
			userId: request.user.sub,
		})

		return reply.status(200).send({
			friendship: toHttpFriendshipSerializer(friendship),
		})
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

		if (error instanceof FriendshipNotPendingError) {
			return reply.status(400).send({
				message: error.message,
			})
		}

		throw error
	}
}
