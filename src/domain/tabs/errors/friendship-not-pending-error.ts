import type { UseCaseError } from '@/core/errors/use-case-error'

export class FriendshipNotPendingError extends Error implements UseCaseError {
	constructor() {
		super('Friendship is not pending.')
	}
}
