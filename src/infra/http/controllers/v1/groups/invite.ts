import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeInviteMemberUseCase } from '@/infra/factories/tabs/make-invite-member-use-case'
import { toHttpGroupMemberSerializer } from '@/infra/http/serializers/group-serializer'

export async function invite(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		groupId: z.string(),
	})

	const bodySchema = z.object({
		inviteeId: z.string(),
	})

	const { groupId } = paramsSchema.parse(request.params)
	const { inviteeId } = bodySchema.parse(request.body)

	const inviteMemberUseCase = makeInviteMemberUseCase()

	const { member } = await inviteMemberUseCase.execute({
		groupId,
		senderId: request.user.sub,
		inviteeId,
	})

	return reply.status(201).send({
		member: toHttpGroupMemberSerializer(member),
	})
}
