import type { EntityError } from '@/core/errors/entity-error'

export class SelfPaymentError extends Error implements EntityError {
	constructor() {
		super('You cannot pay yourself.')
	}
}
