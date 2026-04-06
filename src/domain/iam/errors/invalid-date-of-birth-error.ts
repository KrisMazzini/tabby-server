import { EntityError } from '@/core/errors/entity-error'

export class InvalidDateOfBirthError extends EntityError {
	constructor() {
		super('User must be at least 18 years old.', 'INVALID_DATE_OF_BIRTH', 400)
	}
}
