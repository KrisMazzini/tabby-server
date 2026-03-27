import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { GroupMemberNotPendingError } from '../../errors/group-member-not-pending-error'

export interface GroupMemberProps {
	userId: UniqueEntityId
	status: 'pending' | 'accepted'
	joinedAt?: Date
}

export class GroupMember {
	private props: GroupMemberProps

	private constructor(props: GroupMemberProps) {
		this.props = props
	}

	get userId() {
		return this.props.userId
	}

	get status() {
		return this.props.status
	}

	get joinedAt() {
		return this.props.joinedAt
	}

	acceptInvitation() {
		if (this.props.status !== 'pending') {
			throw new GroupMemberNotPendingError()
		}

		this.props.status = 'accepted'
		this.props.joinedAt = new Date()
	}

	static create(props: GroupMemberProps) {
		return new GroupMember(props)
	}

	static invite(userId: UniqueEntityId) {
		return new GroupMember({ userId, status: 'pending' })
	}

	static accepted(userId: UniqueEntityId, joinedAt: Date) {
		return GroupMember.create({
			userId,
			status: 'accepted',
			joinedAt,
		})
	}
}
