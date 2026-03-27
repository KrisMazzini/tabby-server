import type { EntityError } from '@/core/errors/entity-error'

export class GroupOwnerMustBeAMemberError extends Error implements EntityError {
	constructor() {
		super('The group owner must be a member of the group.')
	}
}
