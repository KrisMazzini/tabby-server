import { EntityError } from '@/core/errors/entity-error'

export class GroupMemberNotFoundError extends EntityError {
	constructor() {
		super(
			'No member with this user id was found in the group.',
			'GROUP_MEMBER_NOT_FOUND',
			404
		)
	}
}
