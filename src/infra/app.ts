import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { treeifyError, ZodError } from 'zod'

import { env } from '@/env'

import { friendshipRoutes } from './http/controllers/v1/friendships/routes'
import { userRoutes } from './http/controllers/v1/users/routes'

export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
	sign: {
		expiresIn: '10m',
	},
})

app.register(fastifyCookie)

app.register(userRoutes, { prefix: '/api/v1' })
app.register(friendshipRoutes, {
	prefix: '/api/v1/friendships',
})

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation error.',
			issues: treeifyError(error),
		})
	}

	if (env.NODE_ENV === 'production') {
		// TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
	} else {
		console.log(error)
	}

	return reply.status(500).send({
		message: 'Internal server error.',
	})
})
