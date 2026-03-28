import type { EntityError } from '@/core/errors/entity-error'

export class EmptySplitSlicesError extends Error implements EntityError {
	constructor() {
		super('Expense split must contain at least one slice.')
	}
}
