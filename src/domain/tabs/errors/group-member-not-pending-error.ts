import { EntityError } from '@/core/errors/entity-error'

export class GroupMemberNotPendingError extends EntityError {
	constructor() {
		super(
			'Only a pending invitation can be accepted.',
			'GROUP_MEMBER_NOT_PENDING',
			400
		)
	}
}
