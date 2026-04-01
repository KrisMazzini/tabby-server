import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidDateOfBirthError } from '@/domain/iam/errors/invalid-date-of-birth-error'
import { UserAlreadyExistsError } from '@/domain/iam/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/infra/factories/iam/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string().trim().min(3),
		email: z.email(),
		dateOfBirth: z.iso.datetime().transform(date => new Date(date)),
	})

	const { name, email, dateOfBirth } = registerBodySchema.parse(request.body)

	try {
		const registerUseCase = makeRegisterUseCase()

		const { user } = await registerUseCase.execute({ name, email, dateOfBirth })

		return reply.status(201).send({ user })
	} catch (error) {
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
