import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { FriendshipAlreadyExistsError } from '@/domain/tabs/errors/friendship-already-exists-error'
import { makeCreateFriendshipUseCase } from '@/infra/factories/tabs/make-create-friendship-use-case'
import { toHttpFriendshipSerializer } from '@/infra/http/serializers/friendship-serializer'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createFriendshipBodySchema = z.object({
		toUserId: z.string(),
	})

	const { toUserId } = createFriendshipBodySchema.parse(request.body)

	try {
		const createFriendshipUseCase = makeCreateFriendshipUseCase()

		const { friendship } = await createFriendshipUseCase.execute({
			fromUserId: request.user.sub,
			toUserId: toUserId,
		})

		return reply.status(201).send({
			friendship: toHttpFriendshipSerializer(friendship),
		})
	} catch (error) {
		if (error instanceof FriendshipAlreadyExistsError) {
			return reply.status(409).send({
				message: error.message,
			})
		}

		throw error
	}
}
