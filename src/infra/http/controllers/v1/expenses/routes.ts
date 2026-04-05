import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/infra/http/middlewares/verify-jwt'

import { create } from './create'
import { deleteExpense } from './delete'
import { list } from './list'
import { update } from './update'

export async function expensesRoutes(app: FastifyInstance) {
	app.post('/', { onRequest: [verifyJwt] }, create)
	app.get('/', { onRequest: [verifyJwt] }, list)
	app.put('/:expenseId', { onRequest: [verifyJwt] }, update)
	app.delete('/:expenseId', { onRequest: [verifyJwt] }, deleteExpense)
}
