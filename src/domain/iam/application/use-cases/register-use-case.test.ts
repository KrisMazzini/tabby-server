import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import { makeUser } from '../../tests/factories/make-user'
import { InMemoryUsersRepository } from '../../tests/repositories/in-memory-users-repositories'
import { RegisterUseCase } from './register-use-case'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

vi.mock('../../validators/validate-date-of-birth', () => {
	return {
		isValidDateOfBirth: vi.fn().mockReturnValue(true),
	}
})

describe('IAM | Use Case: Register', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		sut = new RegisterUseCase(usersRepository)
	})

	it('should be possible to register a new user', async () => {
		const { user } = await sut.execute({
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

	it('should not be possible to register a user with an email that already exists', async () => {
		const user = makeUser({
			email: 'john.doe@example.com',
		})

		usersRepository.items.push(user)

		await expect(
			sut.execute({
				name: 'John Doe',
				email: 'john.doe@example.com',
				dateOfBirth: new Date('1990-01-01'),
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
