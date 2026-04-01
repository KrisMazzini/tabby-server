import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeListFriendshipsUseCase } from '@/infra/factories/tabs/make-list-friendships-use-case'

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const listFriendshipsQuerySchema = z.object({
		page: z.coerce.number().int().positive().optional(),
		size: z.coerce.number().int().positive().optional(),
		status: z.enum(['pending', 'accepted']).optional(),
	})

	const { page, size, status } = listFriendshipsQuerySchema.parse(request.query)

	const listFriendshipsUseCase = makeListFriendshipsUseCase()

	const { friendships, meta } = await listFriendshipsUseCase.execute({
		userId: request.user.sub,
		page,
		size,
		filters: {
			status,
		},
	})

	return reply.status(200).send({
		friendships: friendships.map(friendship => ({
			id: friendship.id.toValue(),
			friend: {
				id: friendship.friend.id.toValue(),
			},
			status: friendship.status,
		})),
		meta,
	})
}
