import { EntityError } from '@/core/errors/entity-error'

export class InvalidAmountError extends EntityError {
	constructor() {
		super('Amount must be greater than zero.', 'INVALID_AMOUNT', 400)
	}
}
