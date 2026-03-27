import type { EntityError } from '@/core/errors/entity-error'

export class DuplicateGroupMemberError extends Error implements EntityError {
	constructor() {
		super('This user is already a member of the group.')
	}
}
