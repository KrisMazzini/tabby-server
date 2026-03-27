import type { EntityError } from '@/core/errors/entity-error'

export class GroupMemberNotPendingError extends Error implements EntityError {
	constructor() {
		super('Only a pending invitation can be accepted.')
	}
}
