import { Entity, type EntityArgs } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { DuplicateGroupMemberError } from '../../errors/duplicate-group-member-error'
import { GroupMemberNotFoundError } from '../../errors/group-member-not-found-error'
import { GroupOwnerMustBeAMemberError } from '../../errors/group-owner-must-be-a-member-error'

import type { Currency } from '../value-objects/currency'
import { GroupMember } from '../value-objects/group-member'

export interface GroupProps {
	name: string
	ownerId: UniqueEntityId
	defaultCurrency: Currency
	members: GroupMember[]
}

export class Group extends Entity<GroupProps> {
	get name() {
		return this.props.name
	}

	get ownerId() {
		return this.props.ownerId
	}

	get members() {
		return this.props.members
	}

	get defaultCurrency() {
		return this.props.defaultCurrency
	}

	set name(name: GroupProps['name']) {
		this.props.name = name
		this.touch()
	}

	set defaultCurrency(defaultCurrency: Currency) {
		this.props.defaultCurrency = defaultCurrency
		this.touch()
	}

	private getMember(userId: UniqueEntityId) {
		return this.props.members.find(member => member.userId.equals(userId))
	}

	hasAcceptedMember(userId: UniqueEntityId) {
		const member = this.getMember(userId)
		return member?.status === 'accepted'
	}

	addMember(userId: UniqueEntityId) {
		const exists = this.getMember(userId)

		if (exists) {
			throw new DuplicateGroupMemberError()
		}

		const member = GroupMember.invite(userId)

		this.props.members.push(member)
		this.touch()

		return member
	}

	removeMember(userId: UniqueEntityId) {
		if (this.ownerId.equals(userId)) {
			throw new GroupOwnerMustBeAMemberError()
		}

		const member = this.getMember(userId)

		if (!member) {
			throw new GroupMemberNotFoundError()
		}

		this.props.members = this.props.members.filter(
			member => !member.userId.equals(userId)
		)
		this.touch()
	}

	acceptMemberInvitation(userId: UniqueEntityId) {
		const member = this.getMember(userId)

		if (!member) {
			throw new GroupMemberNotFoundError()
		}

		member.acceptInvitation()
		this.touch()

		return member
	}

	static create(props: GroupProps, args?: EntityArgs) {
		if (!props.members.some(member => member.userId.equals(props.ownerId))) {
			throw new GroupOwnerMustBeAMemberError()
		}

		return new Group(props, args)
	}
}
