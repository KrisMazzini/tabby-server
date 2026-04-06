import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeRemoveGroupMemberUseCase } from '@/infra/factories/tabs/make-remove-group-member-use-case'
import { toHttpGroupMemberSerializer } from '@/infra/http/serializers/group-serializer'

export async function removeMember(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const paramsSchema = z.object({
		groupId: z.string(),
		memberId: z.string(),
	})

	const { groupId, memberId } = paramsSchema.parse(request.params)

	const removeGroupMemberUseCase = makeRemoveGroupMemberUseCase()

	const { members } = await removeGroupMemberUseCase.execute({
		userId: request.user.sub,
		groupId,
		memberId,
	})

	return reply.status(200).send({
		members: members.map(toHttpGroupMemberSerializer),
	})
}
