import { EntityError } from '@/core/errors/entity-error'

export class PercentageSplitSumError extends EntityError {
	constructor() {
		super(
			'Percentage split values must sum to 100.',
			'PERCENTAGE_SPLIT_SUM',
			400
		)
	}
}
