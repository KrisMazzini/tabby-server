import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { User } from '../../enterprise/entities/user'
import { MagicTokenExpiredError } from '../../errors/magic-token-expired-error'
import { MagicTokenAlreadyUsedError } from '../../errors/magic-token-used-error'
import type { MagicTokensRepository } from '../repositories/magic-tokens-repository'
import type { UsersRepository } from '../repositories/users-repository'

export interface AuthenticateByMagicTokenUseCaseRequest {
	token: string
}

export interface AuthenticateByMagicTokenUseCaseResponse {
	user: User
}

export class AuthenticateByMagicTokenUseCase {
	constructor(
		private readonly magicTokensRepository: MagicTokensRepository,
		private readonly usersRepository: UsersRepository
	) {}

	async execute({
		token,
	}: AuthenticateByMagicTokenUseCaseRequest): Promise<AuthenticateByMagicTokenUseCaseResponse> {
		const magicToken = await this.magicTokensRepository.findById(token)

		if (!magicToken) {
			throw new ResourceNotFoundError('Magic token')
		}

		if (magicToken.isExpired()) {
			throw new MagicTokenExpiredError()
		}

		if (magicToken.hasBeenValidated()) {
			throw new MagicTokenAlreadyUsedError()
		}

		magicToken.markValidated()

		await this.magicTokensRepository.save(magicToken)

		const user = await this.usersRepository.findById(
			magicToken.userId.toString()
		)

		if (!user) {
			throw new ResourceNotFoundError('User')
		}

		return { user }
	}
}
