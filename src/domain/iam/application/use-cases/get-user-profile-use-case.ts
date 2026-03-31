import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { User } from '../../enterprise/entities/user'
import type { UsersRepository } from '../repositories/users-repository'

export interface GetUserProfileRequest {
	id: string
}

export interface GetUserProfileResponse {
	user: User
}

export class GetUserProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		id,
	}: GetUserProfileRequest): Promise<GetUserProfileResponse> {
		const user = await this.usersRepository.findById(id)

		if (!user) {
			throw new ResourceNotFoundError('User')
		}

		return { user }
	}
}
