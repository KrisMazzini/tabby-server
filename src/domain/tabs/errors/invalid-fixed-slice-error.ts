import { EntityError } from '@/core/errors/entity-error'

export class InvalidFixedSliceError extends EntityError {
	constructor() {
		super(
			'Fixed slice value must be greater than or equal zero.',
			'INVALID_FIXED_SLICE',
			400
		)
	}
}
