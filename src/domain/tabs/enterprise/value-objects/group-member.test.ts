import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { GroupMemberNotPendingError } from '../../errors/group-member-not-pending-error'

import { GroupMember } from './group-member'

describe('Tabs | Value object: GroupMember', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create pending invite without joinedAt', () => {
		const userId = new UniqueEntityId()
		const member = GroupMember.invite(userId)

		expect(member.status).toBe('pending')
		expect(member.joinedAt).toBeUndefined()
		expect(member.userId).toBe(userId)
	})

	it('should accept invitation', () => {
		vi.setSystemTime(new Date('2026-03-27'))
		const member = GroupMember.invite(new UniqueEntityId())

		member.acceptInvitation()

		expect(member.status).toBe('accepted')
		expect(member.joinedAt).toEqual(new Date('2026-03-27'))
	})

	it('should not accept invitationtwice', () => {
		const member = GroupMember.invite(new UniqueEntityId())
		member.acceptInvitation()

		expect(() => member.acceptInvitation()).toThrow(GroupMemberNotPendingError)
	})
})
