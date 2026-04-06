import { UseCaseError } from '@/core/errors/use-case-error'

export class UserAlreadyExistsError extends UseCaseError {
	constructor() {
		super('User already exists.', 'USER_ALREADY_EXISTS', 409)
	}
}
