import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { DuplicateGroupMemberError } from '../../errors/duplicate-group-member-error'
import { GroupMemberNotFoundError } from '../../errors/group-member-not-found-error'
import { GroupOwnerMustBeAMemberError } from '../../errors/group-owner-must-be-a-member-error'

import { Currency } from '../value-objects/currency'
import { GroupMember } from '../value-objects/group-member'

import { Group } from './group'

const ownerId = new UniqueEntityId('owner-1')

const defaultCurrency = Currency.create({
	iso: 'BRL',
	name: 'Brazilian Real',
	symbol: 'R$',
})

const groupOwnerMember = GroupMember.create({
	userId: ownerId,
	status: 'accepted',
	joinedAt: new Date(),
})

describe('Tabs | Entity: Group', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be possible to create a group', () => {
		const group = Group.create({
			name: 'Trip',
			defaultCurrency,
			ownerId,
			members: [groupOwnerMember],
		})

		expect(group.name).toBe('Trip')
		expect(group.defaultCurrency).toEqual(defaultCurrency)
		expect(group.ownerId).toBe(ownerId)
		expect(group.members).toEqual([groupOwnerMember])
	})

	it('should not be possible to create a group without its owner as a member', () => {
		expect(() =>
			Group.create({
				name: 'Trip',
				defaultCurrency,
				ownerId: new UniqueEntityId('another-owner'),
				members: [groupOwnerMember],
			})
		).toThrow(GroupOwnerMustBeAMemberError)
	})

	it('should be possible to add a member', () => {
		const group = Group.create({
			name: 'Trip',
			defaultCurrency,
			ownerId: new UniqueEntityId('owner-1'),
			members: [groupOwnerMember],
		})

		const newMemberId = new UniqueEntityId('user-1')

		group.addMember(newMemberId)

		const newMember = group.members[1]

		expect(group.members.length).toBe(2)
		expect(newMember.userId).toBe(newMemberId)
		expect(newMember.status).toBe('pending')
		expect(newMember.joinedAt).toBeUndefined()
	})

	it('should not be possible to add the same user twice', () => {
		const userId = new UniqueEntityId('user-1')

		const group = Group.create({
			name: 'Trip',
			defaultCurrency,
			ownerId: new UniqueEntityId('owner-1'),
			members: [
				groupOwnerMember,
				GroupMember.create({
					userId,
					status: 'accepted',
					joinedAt: new Date(),
				}),
			],
		})

		expect(() => group.addMember(userId)).toThrow(DuplicateGroupMemberError)
	})

	it('should accept invitation and set status and joinedAt', () => {
		const userId = new UniqueEntityId('user-1')
		const group = Group.create({
			name: 'Trip',
			defaultCurrency,
			ownerId,
			members: [
				groupOwnerMember,
				GroupMember.create({ userId, status: 'pending' }),
			],
		})
		vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'))

		group.acceptMemberInvitation(userId)

		const member = group.members[1]

		expect(member.status).toBe('accepted')
		expect(member.joinedAt).toEqual(new Date('2025-01-01T00:00:00.000Z'))
	})

	it('should throw when accepting a user who is not a member', () => {
		const group = Group.create({
			name: 'Trip',
			defaultCurrency,
			ownerId,
			members: [groupOwnerMember],
		})

		expect(() =>
			group.acceptMemberInvitation(new UniqueEntityId('unknown-user'))
		).toThrow(GroupMemberNotFoundError)
	})

	it('should be possible to remove a member', () => {
		const group = Group.create({
			name: 'Trip',
			defaultCurrency,
			ownerId,
			members: [
				groupOwnerMember,
				GroupMember.create({
					userId: new UniqueEntityId('user-1'),
					status: 'accepted',
					joinedAt: new Date(),
				}),
			],
		})

		group.removeMember(new UniqueEntityId('user-1'))

		expect(group.members.length).toBe(1)
		expect(group.members[0]).toEqual(groupOwnerMember)
	})

	it('should not be possible to remove the owner', () => {
		const group = Group.create({
			name: 'Trip',
			defaultCurrency,
			ownerId,
			members: [groupOwnerMember],
		})

		expect(() => group.removeMember(ownerId)).toThrow(
			GroupOwnerMustBeAMemberError
		)
	})

	it('should not be possible to remove a user who is not a member', () => {
		const group = Group.create({
			name: 'Trip',
			defaultCurrency,
			ownerId,
			members: [groupOwnerMember],
		})

		expect(() =>
			group.removeMember(new UniqueEntityId('unknown-user'))
		).toThrow(GroupMemberNotFoundError)
	})
})
