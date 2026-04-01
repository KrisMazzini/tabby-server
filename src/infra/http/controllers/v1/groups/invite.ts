import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DuplicateGroupMemberError } from '@/domain/tabs/errors/duplicate-group-member-error'
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

	try {
		const inviteMemberUseCase = makeInviteMemberUseCase()

		const { member } = await inviteMemberUseCase.execute({
			groupId,
			senderId: request.user.sub,
			inviteeId,
		})

		return reply.status(201).send({
			member: toHttpGroupMemberSerializer(member),
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

		if (error instanceof DuplicateGroupMemberError) {
			return reply.status(409).send({
				message: error.message,
			})
		}

		throw error
	}
}
