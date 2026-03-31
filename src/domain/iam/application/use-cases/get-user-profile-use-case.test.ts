import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeUser } from '../../tests/factories/make-user'
import { InMemoryUsersRepository } from '../../tests/repositories/in-memory-users-repositories'
import { GetUserProfileUseCase } from './get-user-profile-use-case'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('IAM | Use Case: GetUserProfile', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new GetUserProfileUseCase(usersRepository)
	})

	it('should be possible to get a user profile', async () => {
		const userMock = makeUser({}, { id: new UniqueEntityId('user-1') })
		usersRepository.items.push(userMock)

		const { user } = await sut.execute({ id: 'user-1' })

		expect(user).toEqual(userMock)
	})

	it('should not be possible to get a user profile if the user does not exist', async () => {
		await expect(sut.execute({ id: 'user-1' })).rejects.toBeInstanceOf(
			ResourceNotFoundError
		)
	})
})
