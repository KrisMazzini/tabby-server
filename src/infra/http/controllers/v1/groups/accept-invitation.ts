import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeAcceptGroupInvitationUseCase } from '@/infra/factories/tabs/make-accept-group-invitation-use-case'
import { toHttpGroupMemberSerializer } from '@/infra/http/serializers/group-serializer'

export async function acceptInvitation(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const paramsSchema = z.object({
		groupId: z.string(),
	})

	const { groupId } = paramsSchema.parse(request.params)

	const acceptGroupInvitationUseCase = makeAcceptGroupInvitationUseCase()

	const { member } = await acceptGroupInvitationUseCase.execute({
		groupId,
		memberId: request.user.sub,
	})

	return reply.status(200).send({
		member: toHttpGroupMemberSerializer(member),
	})
}
