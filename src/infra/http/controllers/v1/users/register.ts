import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeRegisterUseCase } from '@/infra/factories/iam/make-register-use-case'
import { toHttpUserSerializer } from '@/infra/http/serializers/user-serializer'

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string().trim().min(3),
		email: z.email(),
		dateOfBirth: z.iso.datetime().transform(date => new Date(date)),
	})

	const { name, email, dateOfBirth } = registerBodySchema.parse(request.body)

	const registerUseCase = makeRegisterUseCase()

	const { user } = await registerUseCase.execute({ name, email, dateOfBirth })

	return reply.status(201).send({
		user: toHttpUserSerializer(user),
	})
}
