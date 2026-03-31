import type { UseCaseError } from '@/core/errors/use-case-error'

export class MagicTokenExpiredError extends Error implements UseCaseError {
	constructor() {
		super('Magic token has expired.')
	}
}
