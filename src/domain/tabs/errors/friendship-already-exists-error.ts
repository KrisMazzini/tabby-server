import type { UseCaseError } from '@/core/errors/use-case-error'

export class FriendshipAlreadyExistsError
	extends Error
	implements UseCaseError
{
	constructor() {
		super('Friendship already exists.')
	}
}
