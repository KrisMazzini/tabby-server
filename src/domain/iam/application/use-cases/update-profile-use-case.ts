import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { User } from '../../enterprise/entities/user'
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error'
import type { UsersRepository } from '../repositories/users-repository'

export interface UpdateProfileUseCaseRequest {
	id: string
	name: string
	email: string
	dateOfBirth: Date
}

export interface UpdateProfileUseCaseResponse {
	user: User
}

export class UpdateProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		id,
		name,
		email,
		dateOfBirth,
	}: UpdateProfileUseCaseRequest): Promise<UpdateProfileUseCaseResponse> {
		const user = await this.usersRepository.findById(id)

		if (!user) {
			throw new ResourceNotFoundError('User')
		}

		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail && !userWithSameEmail.equals(user)) {
			throw new UserAlreadyExistsError()
		}

		user.name = name
		user.email = email
		user.dateOfBirth = dateOfBirth

		await this.usersRepository.save(user)

		return { user }
	}
}
