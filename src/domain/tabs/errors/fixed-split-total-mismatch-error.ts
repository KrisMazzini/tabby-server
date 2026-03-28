import type { EntityError } from '@/core/errors/entity-error'

export class FixedSplitTotalMismatchError extends Error implements EntityError {
	constructor() {
		super('Fixed split amounts must sum to the expense total.')
	}
}
