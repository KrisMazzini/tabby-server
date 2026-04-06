import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { Currency } from '@/domain/tabs/enterprise/value-objects/currency'
import { makeUpdateGroupUseCase } from '@/infra/factories/tabs/make-update-group-use-case'
import { toHttpGroupSerializer } from '@/infra/http/serializers/group-serializer'

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		groupId: z.string(),
	})

	const bodySchema = z.object({
		name: z.string().trim().min(1),
		defaultCurrencyIso: z.string().min(3).max(3),
	})

	const { groupId } = paramsSchema.parse(request.params)
	const { name, defaultCurrencyIso } = bodySchema.parse(request.body)

	const updateGroupUseCase = makeUpdateGroupUseCase()

	const { group } = await updateGroupUseCase.execute({
		groupId,
		userId: request.user.sub,
		name,
		defaultCurrency: Currency.create({ iso: defaultCurrencyIso }),
	})

	return reply.status(200).send({
		group: toHttpGroupSerializer(group),
	})
}
