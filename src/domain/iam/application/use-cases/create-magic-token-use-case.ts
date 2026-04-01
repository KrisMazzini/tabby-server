import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { MagicToken } from '../../enterprise/entities/magic-token'
import type { MagicTokensRepository } from '../repositories/magic-tokens-repository'
import type { UsersRepository } from '../repositories/users-repository'

export interface CreateMagicTokenUseCaseRequest {
	email: string
}

export interface CreateMagicTokenUseCaseResponse {
	token: MagicToken
}

export class CreateMagicTokenUseCase {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly magicTokensRepository: MagicTokensRepository
	) {}

	async execute({
		email,
	}: CreateMagicTokenUseCaseRequest): Promise<CreateMagicTokenUseCaseResponse> {
		const user = await this.usersRepository.findByEmail(email)

		if (!user) {
			throw new ResourceNotFoundError('User')
		}

		const userId = user.id.toString()

		const token = MagicToken.create({
			userId: new UniqueEntityId(userId),
		})

		await this.magicTokensRepository.create(token)

		return { token }
	}
}
