import type { EntityError } from '@/core/errors/entity-error'

export class InvalidDateOfBirthError extends Error implements EntityError {
	constructor() {
		super('User must be at least 18 years old.')
	}
}
