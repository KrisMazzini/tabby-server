import type { EntityError } from '@/core/errors/entity-error'

export class SharesSplitError extends Error implements EntityError {
	constructor() {
		super('Shares split values must be greater than 0.')
	}
}
