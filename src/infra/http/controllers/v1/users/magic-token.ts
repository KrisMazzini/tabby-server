import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeCreateMagicTokenUseCase } from '@/infra/factories/iam/make-create-magic-token-use-case'

export async function magicToken(request: FastifyRequest, reply: FastifyReply) {
	const magicTokenBodySchema = z.object({
		email: z.email(),
	})

	const { email } = magicTokenBodySchema.parse(request.body)

	try {
		const createMagicTokenUseCase = makeCreateMagicTokenUseCase()

		await createMagicTokenUseCase.execute({ email })

		return reply.status(201).send()
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		throw error
	}
}
