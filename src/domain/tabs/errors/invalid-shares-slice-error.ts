import { EntityError } from '@/core/errors/entity-error'

export class InvalidSharesSliceError extends EntityError {
	constructor() {
		super(
			'Shares slice value must be greater than or equal zero.',
			'INVALID_SHARES_SLICE',
			400
		)
	}
}
