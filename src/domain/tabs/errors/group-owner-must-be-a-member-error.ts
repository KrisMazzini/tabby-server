import { EntityError } from '@/core/errors/entity-error'

export class GroupOwnerMustBeAMemberError extends EntityError {
	constructor() {
		super(
			'The group owner must be a member of the group.',
			'GROUP_OWNER_MUST_BE_A_MEMBER',
			400
		)
	}
}
