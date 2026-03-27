import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GroupMember } from '../../enterprise/value-objects/group-member'
import { makeGroup } from '../../tests/factories/make-group'
import { InMemoryGroupsRepository } from '../../tests/repositories/in-memory-groups-repository'

import { InviteMemberUseCase } from './invite-member-use-case'

let groupsRepository: InMemoryGroupsRepository
let sut: InviteMemberUseCase

describe('Tabs | Use Case: InviteMember', () => {
	beforeEach(() => {
		groupsRepository = new InMemoryGroupsRepository()
		sut = new InviteMemberUseCase(groupsRepository)
	})

	it('should invite a new member when the sender is an accepted member', async () => {
		const ownerId = new UniqueEntityId('owner-1')
		const acceptedMemberId = new UniqueEntityId('user-a')

		const group = makeGroup({
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.accepted(acceptedMemberId, new Date()),
			],
		})

		await groupsRepository.create(group)

		const { member } = await sut.execute({
			groupId: group.id.toString(),
			senderId: 'user-a',
			inviteeId: 'user-b',
		})

		expect(member.userId.toString()).toBe('user-b')
		expect(member.status).toBe('pending')
		expect(member.joinedAt).toBeUndefined()

		const persisted = await groupsRepository.findById(group.id.toString())

		expect(persisted?.members).toHaveLength(3)
	})

	it('should not invite when the group does not exist', async () => {
		await expect(
			sut.execute({
				groupId: 'unknown-group',
				senderId: 'owner-1',
				inviteeId: 'user-a',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not invite when the sender is not an accepted member', async () => {
		const ownerId = new UniqueEntityId('owner-1')
		const pendingId = new UniqueEntityId('pending-user')

		const group = makeGroup({
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.invite(pendingId),
			],
		})

		await groupsRepository.create(group)

		await expect(
			sut.execute({
				groupId: group.id.toString(),
				senderId: 'pending-user',
				inviteeId: 'user-a',
			})
		).rejects.toBeInstanceOf(NotAllowedError)
	})

	it('should not invite when the sender is not in the group', async () => {
		const group = makeGroup()

		await groupsRepository.create(group)

		await expect(
			sut.execute({
				groupId: group.id.toString(),
				senderId: 'stranger',
				inviteeId: 'user-a',
			})
		).rejects.toBeInstanceOf(NotAllowedError)
	})
})
