import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import { makeUser } from '../../tests/factories/make-user'
import { InMemoryUsersRepository } from '../../tests/repositories/in-memory-users-repositories'

import { UpdateProfileUseCase } from './update-profile-use-case'

let usersRepository: InMemoryUsersRepository
let sut: UpdateProfileUseCase

describe('IAM | Use Case: UpdateProfile', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new UpdateProfileUseCase(usersRepository)
	})

	it('should be possible to update a user profile', async () => {
		usersRepository.items.push(
			makeUser({}, { id: new UniqueEntityId('user-1') })
		)

		const { user } = await sut.execute({
			id: 'user-1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			dateOfBirth: new Date('1990-01-01'),
		})

		expect(user.name).toBe('John Doe')
		expect(user.email).toBe('john.doe@example.com')
		expect(user.dateOfBirth).toEqual(new Date('1990-01-01'))

		expect(usersRepository.items).toHaveLength(1)
		expect(usersRepository.items).toEqual([user])
	})

	it('should not be possible to update a user profile if the user does not exist', async () => {
		await expect(
			sut.execute({
				id: 'user-1',
				name: 'John Doe',
				email: 'john.doe@example.com',
				dateOfBirth: new Date('1990-01-01'),
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be possible to update a user profile if the email is already in use', async () => {
		usersRepository.items.push(
			makeUser({}, { id: new UniqueEntityId('user-1') }),
			makeUser(
				{ email: 'john.doe@example.com' },
				{ id: new UniqueEntityId('user-2') }
			)
		)

		await expect(
			sut.execute({
				id: 'user-1',
				name: 'John Doe',
				email: 'john.doe@example.com',
				dateOfBirth: new Date('1990-01-01'),
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})

	it('should be possible to keep the same email when updating a user profile', async () => {
		usersRepository.items.push(
			makeUser(
				{ email: 'john.doe@example.com' },
				{ id: new UniqueEntityId('user-1') }
			)
		)

		const { user } = await sut.execute({
			id: 'user-1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			dateOfBirth: new Date('1990-01-01'),
		})

		expect(user.email).toBe('john.doe@example.com')
	})
})
