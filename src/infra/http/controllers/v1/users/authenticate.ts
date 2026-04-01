import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { MagicTokenExpiredError } from '@/domain/iam/errors/magic-token-expired-error'
import { MagicTokenAlreadyUsedError } from '@/domain/iam/errors/magic-token-used-error'
import { makeAuthenticateByMagicTokenUseCase } from '@/infra/factories/iam/make-authenticate-by-magic-token-use-case'

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const authenticateBodySchema = z.object({
		token: z.string(),
	})

	const { token: magicToken } = authenticateBodySchema.parse(request.body)

	try {
		const authenticateByMagicTokenUseCase =
			makeAuthenticateByMagicTokenUseCase()

		const { user } = await authenticateByMagicTokenUseCase.execute({
			token: magicToken,
		})

		const accessToken = await reply.jwtSign(
			{
				role: 'USER',
			},
			{
				sign: {
					sub: user.id.toString(),
				},
			}
		)

		const refreshToken = await reply.jwtSign(
			{
				role: 'USER',
			},
			{
				sign: {
					sub: user.id.toString(),
					expiresIn: '7d',
				},
			}
		)

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({ accessToken })
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		if (error instanceof MagicTokenExpiredError) {
			return reply.status(400).send({
				message: error.message,
			})
		}

		if (error instanceof MagicTokenAlreadyUsedError) {
			return reply.status(400).send({
				message: error.message,
			})
		}

		throw error
	}
}
