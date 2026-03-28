import type { EntityError } from '@/core/errors/entity-error'

export class DuplicateUserInSplitError extends Error implements EntityError {
	constructor() {
		super('Expense split cannot include the same user more than once.')
	}
}
