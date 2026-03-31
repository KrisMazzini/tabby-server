import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { MagicToken } from '../../enterprise/entities/magic-token'
import type { MagicTokensRepository } from '../repositories/magic-tokens-repository'
import type { UsersRepository } from '../repositories/users-repository'

export interface CreateMagicTokenUseCaseRequest {
	userId: string
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
		userId,
	}: CreateMagicTokenUseCaseRequest): Promise<CreateMagicTokenUseCaseResponse> {
		const user = await this.usersRepository.findById(userId)

		if (!user) {
			throw new ResourceNotFoundError('User')
		}

		const token = MagicToken.create({
			userId: new UniqueEntityId(userId),
		})

		await this.magicTokensRepository.create(token)

		return { token }
	}
}
