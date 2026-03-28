import type { EntityError } from '@/core/errors/entity-error'

export class InvalidTotalAmountError extends Error implements EntityError {
	constructor() {
		super('Total amount must be greater than zero.')
	}
}
