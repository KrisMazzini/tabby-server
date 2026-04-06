import { EntityError } from '@/core/errors/entity-error'

export class DuplicateUserInSplitError extends EntityError {
	constructor() {
		super(
			'Expense split cannot include the same user more than once.',
			'DUPLICATE_USER_IN_SPLIT',
			409
		)
	}
}
