import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/infra/http/middlewares/verify-jwt'

import { create } from './create'
import { deletePayment } from './delete'
import { list } from './list'
import { update } from './update'

export async function paymentsRoutes(app: FastifyInstance) {
	app.post('/', { onRequest: [verifyJwt] }, create)
	app.get('/', { onRequest: [verifyJwt] }, list)
	app.patch('/:paymentId', { onRequest: [verifyJwt] }, update)
	app.delete('/:paymentId', { onRequest: [verifyJwt] }, deletePayment)
}
