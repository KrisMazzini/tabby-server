import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GroupMember } from '../../enterprise/value-objects/group-member'
import { makeGroup } from '../../tests/factories/make-group'
import { InMemoryGroupsRepository } from '../../tests/repositories/in-memory-groups-repository'

import { RemoveGroupMemberUseCase } from './remove-group-member-use-case'

let groupsRepository: InMemoryGroupsRepository
let sut: RemoveGroupMemberUseCase

describe('Tabs | Use Case: RemoveGroupMember', () => {
	beforeEach(() => {
		groupsRepository = new InMemoryGroupsRepository()
		sut = new RemoveGroupMemberUseCase(groupsRepository)
	})

	it('should remove a member when the executor is the owner', async () => {
		const ownerId = new UniqueEntityId('owner-1')
		const memberUserId = new UniqueEntityId('user-2')

		const group = makeGroup({
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.accepted(memberUserId, new Date()),
			],
		})

		await groupsRepository.create(group)

		const { members } = await sut.execute({
			groupId: group.id.toString(),
			userId: 'owner-1',
			memberId: 'user-2',
		})

		expect(members).toHaveLength(1)
		expect(members[0].userId.toString()).toBe('owner-1')

		const persisted = await groupsRepository.findById(group.id.toString())

		expect(persisted?.members).toHaveLength(1)
	})

	it('should not remove when the group does not exist', async () => {
		await expect(
			sut.execute({
				groupId: 'unknown-group',
				userId: 'owner-1',
				memberId: 'user-2',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not remove when the executor is not the owner', async () => {
		const ownerId = new UniqueEntityId('owner-1')
		const group = makeGroup({
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.accepted(new UniqueEntityId('user-2'), new Date()),
			],
		})

		await groupsRepository.create(group)

		await expect(
			sut.execute({
				groupId: group.id.toString(),
				userId: 'user-2',
				memberId: 'owner-1',
			})
		).rejects.toBeInstanceOf(NotAllowedError)
	})
})
