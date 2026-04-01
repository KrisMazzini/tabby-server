import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GroupMemberNotFoundError } from '@/domain/tabs/errors/group-member-not-found-error'
import { GroupOwnerMustBeAMemberError } from '@/domain/tabs/errors/group-owner-must-be-a-member-error'
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

	try {
		const removeGroupMemberUseCase = makeRemoveGroupMemberUseCase()

		const { members } = await removeGroupMemberUseCase.execute({
			userId: request.user.sub,
			groupId,
			memberId,
		})

		return reply.status(200).send({
			members: members.map(toHttpGroupMemberSerializer),
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

		if (
			error instanceof GroupMemberNotFoundError ||
			error instanceof GroupOwnerMustBeAMemberError
		) {
			return reply.status(400).send({
				message: error.message,
			})
		}

		throw error
	}
}
