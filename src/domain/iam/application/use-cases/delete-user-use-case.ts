import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { UsersRepository } from '../repositories/users-repository'

export interface DeleteUserUseCaseRequest {
	id: string
}

export class DeleteUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ id }: DeleteUserUseCaseRequest): Promise<void> {
		const user = await this.usersRepository.findById(id)

		if (!user) {
			throw new ResourceNotFoundError('User')
		}

		await this.usersRepository.delete(user)
	}
}
