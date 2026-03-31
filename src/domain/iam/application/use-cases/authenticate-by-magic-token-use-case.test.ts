import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { MagicToken } from '../../enterprise/entities/magic-token'
import type { User } from '../../enterprise/entities/user'
import { MagicTokenExpiredError } from '../../errors/magic-token-expired-error'
import { MagicTokenAlreadyUsedError } from '../../errors/magic-token-used-error'
import { makeMagicToken } from '../../tests/factories/make-magic-token'
import { makeUser } from '../../tests/factories/make-user'
import { InMemoryMagicTokensRepository } from '../../tests/repositories/in-memory-magic-tokens-repository'
import { InMemoryUsersRepository } from '../../tests/repositories/in-memory-users-repositories'

import { AuthenticateByMagicTokenUseCase } from './authenticate-by-magic-token-use-case'

let usersRepository: InMemoryUsersRepository
let magicTokensRepository: InMemoryMagicTokensRepository
let sut: AuthenticateByMagicTokenUseCase

let user: User
let magicToken: MagicToken

describe('IAM | Use Case: Authenticate by magic token', () => {
	beforeEach(() => {
		vi.useFakeTimers()

		usersRepository = new InMemoryUsersRepository()
		magicTokensRepository = new InMemoryMagicTokensRepository()
		sut = new AuthenticateByMagicTokenUseCase(
			magicTokensRepository,
			usersRepository
		)

		user = makeUser({}, { id: new UniqueEntityId('user-1') })
		magicToken = makeMagicToken(
			{
				userId: user.id,
			},
			{ id: new UniqueEntityId('magic-token-1') }
		)

		usersRepository.items.push(user)
		magicTokensRepository.items.push(magicToken)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should authenticate with a valid token', async () => {
		vi.setSystemTime(new Date('2026-03-31T12:00:00.000Z'))

		const result = await sut.execute({ token: 'magic-token-1' })

		expect(result.user).toEqual(user)
		expect(magicToken.validatedAt).toEqual(new Date('2026-03-31T12:00:00.000Z'))
	})

	it('should not authenticate with an unknown token', async () => {
		await expect(
			sut.execute({ token: 'non-existent-id' })
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not authenticate with an expired token', async () => {
		const expiredMagicToken = makeMagicToken(
			{
				userId: new UniqueEntityId('user-1'),
				expiresAt: new Date('2026-03-31T11:59:00.000Z'),
			},
			{ id: new UniqueEntityId('expired-magic-token') }
		)

		magicTokensRepository.items.push(expiredMagicToken)

		vi.setSystemTime(new Date('2026-03-31T12:00:00.000Z'))

		await expect(
			sut.execute({ token: 'expired-magic-token' })
		).rejects.toBeInstanceOf(MagicTokenExpiredError)
	})

	it('should not authenticate with a used token', async () => {
		const usedMagicToken = makeMagicToken(
			{
				userId: new UniqueEntityId('user-1'),
				validatedAt: new Date('2026-03-31T12:00:00.000Z'),
			},
			{ id: new UniqueEntityId('used-magic-token') }
		)

		magicTokensRepository.items.push(usedMagicToken)

		await expect(
			sut.execute({ token: 'used-magic-token' })
		).rejects.toBeInstanceOf(MagicTokenAlreadyUsedError)
	})
})
