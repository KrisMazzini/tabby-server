import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'
import { makeCreateGroupUseCase } from '@/infra/factories/tabs/make-create-group-use-case'
import { toHttpGroupSerializer } from '@/infra/http/serializers/group-serializer'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createGroupBodySchema = z.object({
		name: z.string().trim().min(1),
		defaultCurrencyISO: z.string().min(3).max(3),
		inviteeIds: z.array(z.string()).optional(),
	})

	const { name, defaultCurrencyISO, inviteeIds } = createGroupBodySchema.parse(
		request.body
	)

	const createGroupUseCase = makeCreateGroupUseCase()

	const { group } = await createGroupUseCase.execute({
		ownerId: request.user.sub,
		name,
		defaultCurrency: Currency.create({ iso: defaultCurrencyISO }),
		inviteeIds,
	})

	return reply.status(201).send({
		group: toHttpGroupSerializer(group),
	})
}
