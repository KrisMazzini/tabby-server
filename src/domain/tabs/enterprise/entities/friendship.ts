import { Entity, type EntityArgs } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { SelfFriendshipError } from '../../errors/self-friendship-error'

export interface FriendshipProps {
	fromUserId: UniqueEntityId
	toUserId: UniqueEntityId
	status: 'pending' | 'accepted' | 'blocked'
}

export class Friendship extends Entity<FriendshipProps> {
	get fromUserId() {
		return this.props.fromUserId
	}

	get toUserId() {
		return this.props.toUserId
	}

	get status() {
		return this.props.status
	}

	set status(status: FriendshipProps['status']) {
		this.props.status = status
		this.touch()
	}

	static create(props: FriendshipProps, args?: EntityArgs) {
		if (props.fromUserId.equals(props.toUserId)) {
			throw new SelfFriendshipError()
		}

		const friendship = new Friendship(props, args)

		return friendship
	}
}
