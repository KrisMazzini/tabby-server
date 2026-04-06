import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { env } from '@/env'
import { makeCreateMagicTokenUseCase } from '@/infra/factories/iam/make-create-magic-token-use-case'

export async function magicToken(request: FastifyRequest, reply: FastifyReply) {
	const magicTokenBodySchema = z.object({
		email: z.email(),
	})

	const { email } = magicTokenBodySchema.parse(request.body)

	const createMagicTokenUseCase = makeCreateMagicTokenUseCase()

	const { token } = await createMagicTokenUseCase.execute({ email })

	if (env.NODE_ENV === 'development') {
		return reply.status(201).send({
			token,
		})
	}

	return reply.status(201).send()
}
