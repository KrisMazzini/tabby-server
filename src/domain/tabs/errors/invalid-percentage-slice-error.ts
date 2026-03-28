import type { EntityError } from '@/core/errors/entity-error'

export class InvalidPercentageSliceError extends Error implements EntityError {
	constructor() {
		super('Percentage slice value must be between 0 and 100.')
	}
}
