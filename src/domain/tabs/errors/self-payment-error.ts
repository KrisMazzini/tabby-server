import { EntityError } from '@/core/errors/entity-error'

export class SelfPaymentError extends EntityError {
	constructor() {
		super('You cannot pay yourself.', 'SELF_PAYMENT', 400)
	}
}
