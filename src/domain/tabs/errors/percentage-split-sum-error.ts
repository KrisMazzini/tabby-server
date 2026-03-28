import type { EntityError } from '@/core/errors/entity-error'

export class PercentageSplitSumError extends Error implements EntityError {
	constructor() {
		super('Percentage split values must sum to 100.')
	}
}
