import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { InvalidDateOfBirthError } from '@/domain/iam/errors/invalid-date-of-birth-error'
import { UserAlreadyExistsError } from '@/domain/iam/errors/user-already-exists-error'
import { makeUpdateProfileUseCase } from '@/infra/factories/iam/make-update-profile-use-case'
import { toHttpUserSerializer } from '@/infra/http/serializers/user-serializer'

export async function updateProfile(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const updateProfileBodySchema = z.object({
		name: z.string().trim().min(3),
		email: z.email(),
		dateOfBirth: z.iso.datetime().transform(date => new Date(date)),
	})

	const { name, email, dateOfBirth } = updateProfileBodySchema.parse(
		request.body
	)

	try {
		const updateProfileUseCase = makeUpdateProfileUseCase()

		const { user } = await updateProfileUseCase.execute({
			id: request.user.sub,
			name,
			email,
			dateOfBirth,
		})

		return reply.status(200).send({
			user: toHttpUserSerializer(user),
		})
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		if (error instanceof UserAlreadyExistsError) {
			return reply.status(409).send({
				message: error.message,
			})
		}

		if (error instanceof InvalidDateOfBirthError) {
			return reply.status(400).send({
				message: error.message,
			})
		}

		throw error
	}
}
