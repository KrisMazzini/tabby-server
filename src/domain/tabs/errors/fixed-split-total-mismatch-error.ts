import { EntityError } from '@/core/errors/entity-error'

export class FixedSplitTotalMismatchError extends EntityError {
	constructor() {
		super(
			'Fixed split amounts must sum to the expense total.',
			'FIXED_SPLIT_TOTAL_MISMATCH',
			400
		)
	}
}
