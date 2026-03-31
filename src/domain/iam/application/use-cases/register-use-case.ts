import { User } from '../../enterprise/entities/user'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import type { UsersRepository } from '../repositories/users-repository'

export interface RegisterUseCaseRequest {
	name: string
	email: string
	dateOfBirth: Date
}

export interface RegisterUseCaseResponse {
	user: User
}

export class RegisterUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({
		name,
		email,
		dateOfBirth,
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const existingUser = await this.usersRepository.findByEmail(email)

		if (existingUser) {
			throw new UserAlreadyExistsError()
		}

		const user = User.create({ name, email, dateOfBirth })

		await this.usersRepository.create(user)

		return { user }
	}
}
