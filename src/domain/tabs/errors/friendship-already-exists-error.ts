import { UseCaseError } from '@/core/errors/use-case-error'

export class FriendshipAlreadyExistsError extends UseCaseError {
	constructor() {
		super('Friendship already exists.', 'FRIENDSHIP_ALREADY_EXISTS', 409)
	}
}
