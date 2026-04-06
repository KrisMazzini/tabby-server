import { EntityError } from '@/core/errors/entity-error'

export class InvalidPercentageSliceError extends EntityError {
	constructor() {
		super(
			'Percentage slice value must be between 0 and 100.',
			'INVALID_PERCENTAGE_SLICE',
			400
		)
	}
}
