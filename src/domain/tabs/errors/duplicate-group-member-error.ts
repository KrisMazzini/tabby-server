import { EntityError } from '@/core/errors/entity-error'

export class DuplicateGroupMemberError extends EntityError {
	constructor() {
		super(
			'This user is already a member of the group.',
			'DUPLICATE_GROUP_MEMBER',
			409
		)
	}
}
