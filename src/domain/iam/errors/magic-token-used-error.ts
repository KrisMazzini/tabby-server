import { UseCaseError } from '@/core/errors/use-case-error'

export class MagicTokenAlreadyUsedError extends UseCaseError {
	constructor() {
		super('Magic token has already been used.', 'MAGIC_TOKEN_ALREADY_USED', 400)
	}
}
