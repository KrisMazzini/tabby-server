import type { UseCaseError } from '@/core/errors/use-case-error'

export class MagicTokenAlreadyUsedError extends Error implements UseCaseError {
	constructor() {
		super('Magic token has already been used.')
	}
}
