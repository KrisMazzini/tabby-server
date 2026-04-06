import { UseCaseError } from '@/core/errors/use-case-error'

export class FriendshipNotPendingError extends UseCaseError {
	constructor() {
		super('Friendship is not pending.', 'FRIENDSHIP_NOT_PENDING', 400)
	}
}
