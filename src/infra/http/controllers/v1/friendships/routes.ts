import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/infra/http/middlewares/verify-jwt'

import { accept } from './accept'
import { create } from './create'
import { list } from './list'

export async function friendshipRoutes(app: FastifyInstance) {
	app.post('/', { onRequest: [verifyJwt] }, create)
	app.patch('/:friendshipId/accept', { onRequest: [verifyJwt] }, accept)
	app.get('/', { onRequest: [verifyJwt] }, list)
}
