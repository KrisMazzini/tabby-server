import type { EntityError } from '@/core/errors/entity-error'

export class InvalidFixedSliceError extends Error implements EntityError {
	constructor() {
		super('Fixed slice value must be greater than or equal zero.')
	}
}
