import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/infra/http/middlewares/verify-jwt'

import { authenticate } from './authenticate'
import { magicToken } from './magic-token'
import { profile } from './profile'
import { refresh } from './refresh'
import { register } from './register'

export async function userRoutes(app: FastifyInstance) {
	app.post('/users', register)
	app.post('/auth/magic-tokens', magicToken)
	app.post('/auth/sessions', authenticate)
	app.patch('/auth/sessions/refresh', refresh)
	app.get('/me', { onRequest: [verifyJwt] }, profile)
}
