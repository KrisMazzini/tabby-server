import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GroupMember } from '../../enterprise/value-objects/group-member'
import { GroupMemberNotFoundError } from '../../errors/group-member-not-found-error'
import { makeGroup } from '../../tests/factories/make-group'
import { InMemoryGroupsRepository } from '../../tests/repositories/in-memory-groups-repository'

import { AcceptGroupInvitationUseCase } from './accept-group-invitation-use-case'

let groupsRepository: InMemoryGroupsRepository
let sut: AcceptGroupInvitationUseCase

describe('Tabs | Use Case: AcceptGroupInvitation', () => {
	beforeEach(() => {
		groupsRepository = new InMemoryGroupsRepository()
		sut = new AcceptGroupInvitationUseCase(groupsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should accept a pending invitation', async () => {
		vi.setSystemTime(new Date('2026-04-01T10:00:00.000Z'))

		const ownerId = new UniqueEntityId('owner-1')
		const inviteeId = new UniqueEntityId('user-2')
		const group = makeGroup({
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.invite(inviteeId),
			],
		})

		await groupsRepository.create(group)

		const { member } = await sut.execute({
			groupId: group.id.toString(),
			memberId: 'user-2',
		})

		expect(member.status).toBe('accepted')
		expect(member.joinedAt).toEqual(new Date('2026-04-01T10:00:00.000Z'))

		const persisted = await groupsRepository.findById(group.id.toString())

		expect(persisted?.members[1].status).toBe('accepted')
	})

	it('should not accept when the group does not exist', async () => {
		await expect(
			sut.execute({
				groupId: 'unknown-group',
				memberId: 'user-2',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not accept when the user is not a member', async () => {
		const group = makeGroup()

		await groupsRepository.create(group)

		await expect(
			sut.execute({
				groupId: group.id.toString(),
				memberId: 'unknown',
			})
		).rejects.toBeInstanceOf(GroupMemberNotFoundError)
	})
})
