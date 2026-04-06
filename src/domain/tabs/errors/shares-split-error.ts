import { EntityError } from '@/core/errors/entity-error'

export class SharesSplitError extends EntityError {
	constructor() {
		super('Shares split values must be greater than 0.', 'SHARES_SPLIT', 400)
	}
}
