import { EntityError } from '@/core/errors/entity-error'

export class EmptySplitSlicesError extends EntityError {
	constructor() {
		super(
			'Expense split must contain at least one slice.',
			'EMPTY_SPLIT_SLICES',
			400
		)
	}
}
