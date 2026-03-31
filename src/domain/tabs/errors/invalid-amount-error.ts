import type { EntityError } from '@/core/errors/entity-error'

export class InvalidAmountError extends Error implements EntityError {
	constructor() {
		super('Amount must be greater than zero.')
	}
}
