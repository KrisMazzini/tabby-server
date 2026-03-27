import type { EntityError } from '@/core/errors/entity-error'

export class GroupMemberNotFoundError extends Error implements EntityError {
	constructor() {
		super('No member with this user id was found in the group.')
	}
}
