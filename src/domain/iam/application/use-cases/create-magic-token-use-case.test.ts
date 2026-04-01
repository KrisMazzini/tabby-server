import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { makeUser } from '../../tests/factories/make-user'
import { InMemoryMagicTokensRepository } from '../../tests/repositories/in-memory-magic-tokens-repository'
import { InMemoryUsersRepository } from '../../tests/repositories/in-memory-users-repositories'

import { CreateMagicTokenUseCase } from './create-magic-token-use-case'

let usersRepository: InMemoryUsersRepository
let magicTokensRepository: InMemoryMagicTokensRepository
let sut: CreateMagicTokenUseCase

describe('IAM | Use Case: Create magic token', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		magicTokensRepository = new InMemoryMagicTokensRepository()

		sut = new CreateMagicTokenUseCase(usersRepository, magicTokensRepository)
	})

	it('should create a magic token for an existing user', async () => {
		const user = makeUser(
			{ email: 'john.doe@example.com' },
			{ id: new UniqueEntityId('user-1') }
		)
		usersRepository.items.push(user)

		const { token } = await sut.execute({ email: 'john.doe@example.com' })

		expect(token.userId.toString()).toBe('user-1')
		expect(token.expiresAt).toBeInstanceOf(Date)
		expect(token.validatedAt).toBeNull()

		expect(magicTokensRepository.items).toHaveLength(1)
		expect(magicTokensRepository.items[0]).toBe(token)
	})

	it('should not create a token when user is not found', async () => {
		await expect(
			sut.execute({ email: 'non-existent-user@email.com' })
		).rejects.toBeInstanceOf(ResourceNotFoundError)

		expect(magicTokensRepository.items).toHaveLength(0)
	})
})
