import type { EntityError } from '@/core/errors/entity-error'

export class SelfFriendshipError extends Error implements EntityError {
	constructor() {
		super('You cannot create a friendship with yourself.')
	}
}
