import type { EntityError } from '@/core/errors/entity-error'

export class InvalidSharesSliceError extends Error implements EntityError {
	constructor() {
		super('Shares slice value must be greater than or equal zero.')
	}
}
