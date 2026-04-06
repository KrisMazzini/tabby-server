import { UseCaseError } from '@/core/errors/use-case-error'

export class MagicTokenExpiredError extends UseCaseError {
	constructor() {
		super('Magic token has expired.', 'MAGIC_TOKEN_EXPIRED', 400)
	}
}
