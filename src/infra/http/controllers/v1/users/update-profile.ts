import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateProfileUseCase } from '@/infra/factories/iam/make-update-profile-use-case'
import { toHttpUserSerializer } from '@/infra/http/serializers/user-serializer'

export async function updateProfile(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const updateProfileBodySchema = z.object({
		name: z.string().trim().min(3),
		email: z.email(),
		dateOfBirth: z.iso.datetime().transform(date => new Date(date)),
	})

	const { name, email, dateOfBirth } = updateProfileBodySchema.parse(
		request.body
	)

	const updateProfileUseCase = makeUpdateProfileUseCase()

	const { user } = await updateProfileUseCase.execute({
		id: request.user.sub,
		name,
		email,
		dateOfBirth,
	})

	return reply.status(200).send({
		user: toHttpUserSerializer(user),
	})
}
