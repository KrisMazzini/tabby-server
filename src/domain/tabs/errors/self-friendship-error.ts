import { EntityError } from '@/core/errors/entity-error'

export class SelfFriendshipError extends EntityError {
	constructor() {
		super(
			'You cannot create a friendship with yourself.',
			'SELF_FRIENDSHIP',
			400
		)
	}
}
