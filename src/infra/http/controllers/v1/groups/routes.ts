import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/infra/http/middlewares/verify-jwt'

import { acceptInvitation } from './accept-invitation'
import { create } from './create'
import { deleteGroup } from './delete'
import { invite } from './invite'
import { list } from './list'
import { removeMember } from './remove-member'
import { update } from './update'

export async function groupRoutes(app: FastifyInstance) {
	app.post('/', { onRequest: [verifyJwt] }, create)
	app.get('/', { onRequest: [verifyJwt] }, list)
	app.patch('/:groupId', { onRequest: [verifyJwt] }, update)
	app.delete('/:groupId', { onRequest: [verifyJwt] }, deleteGroup)
	app.post('/:groupId/members', { onRequest: [verifyJwt] }, invite)
	app.delete(
		'/:groupId/members/:memberId',
		{ onRequest: [verifyJwt] },
		removeMember
	)
	app.patch(
		'/:groupId/accept-invitation',
		{ onRequest: [verifyJwt] },
		acceptInvitation
	)
}
