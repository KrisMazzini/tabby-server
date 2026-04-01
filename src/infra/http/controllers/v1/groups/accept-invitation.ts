import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GroupMemberNotFoundError } from '@/domain/tabs/errors/group-member-not-found-error'
import { GroupMemberNotPendingError } from '@/domain/tabs/errors/group-member-not-pending-error'
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

	try {
		const acceptGroupInvitationUseCase = makeAcceptGroupInvitationUseCase()

		const { member } = await acceptGroupInvitationUseCase.execute({
			groupId,
			memberId: request.user.sub,
		})

		return reply.status(200).send({
			member: toHttpGroupMemberSerializer(member),
		})
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		if (error instanceof GroupMemberNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		if (error instanceof GroupMemberNotPendingError) {
			return reply.status(400).send({
				message: error.message,
			})
		}

		throw error
	}
}
