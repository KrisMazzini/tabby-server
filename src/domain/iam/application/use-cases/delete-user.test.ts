import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { makeUser } from '../../tests/factories/make-user'
import { InMemoryUsersRepository } from '../../tests/repositories/in-memory-users-repositories'

import { DeleteUserUseCase } from './delete-user'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('IAM | Use Case: DeleteUser', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new DeleteUserUseCase(usersRepository)
	})

	it('should be possible to delete a user', async () => {
		const userMock = makeUser({}, { id: new UniqueEntityId('user-1') })
		usersRepository.items.push(userMock)

		await sut.execute({ id: 'user-1' })

		expect(usersRepository.items).toHaveLength(0)
	})

	it('should not be possible to delete a user if the user does not exist', async () => {
		const userMock = makeUser({}, { id: new UniqueEntityId('user-1') })
		usersRepository.items.push(userMock)

		await expect(sut.execute({ id: 'unknown-user' })).rejects.toBeInstanceOf(
			ResourceNotFoundError
		)

		expect(usersRepository.items).toHaveLength(1)
	})
})
