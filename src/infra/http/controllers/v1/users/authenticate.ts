import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeAuthenticateByMagicTokenUseCase } from '@/infra/factories/iam/make-authenticate-by-magic-token-use-case'

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const authenticateBodySchema = z.object({
		token: z.string(),
	})

	const { token: magicToken } = authenticateBodySchema.parse(request.body)

	const authenticateByMagicTokenUseCase = makeAuthenticateByMagicTokenUseCase()

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
}
