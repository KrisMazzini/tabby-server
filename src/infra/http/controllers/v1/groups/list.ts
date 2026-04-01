import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeListGroupsUseCase } from '@/infra/factories/tabs/make-list-groups-use-case'
import { toHttpGroupSerializer } from '@/infra/http/serializers/group-serializer'

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const listGroupsQuerySchema = z.object({
		page: z.coerce.number().int().positive().optional(),
		size: z.coerce.number().int().positive().optional(),
		membershipStatus: z.enum(['pending', 'accepted']).optional(),
		ownership: z.enum(['owner']).optional(),
		q: z.string().optional(),
	})

	const { page, size, membershipStatus, ownership, q } =
		listGroupsQuerySchema.parse(request.query)

	const listGroupsUseCase = makeListGroupsUseCase()

	const { groups, meta } = await listGroupsUseCase.execute({
		userId: request.user.sub,
		page,
		size,
		filters: {
			membershipStatus,
			ownership,
			q,
		},
	})

	return reply.status(200).send({
		groups: groups.map(toHttpGroupSerializer),
		meta,
	})
}
