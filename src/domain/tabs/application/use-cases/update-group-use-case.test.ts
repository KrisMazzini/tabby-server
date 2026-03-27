import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GroupMember } from '../../enterprise/value-objects/group-member'
import { makeGroup } from '../../tests/factories/make-group'
import { InMemoryGroupsRepository } from '../../tests/repositories/in-memory-groups-repository'

import { UpdateGroupUseCase } from './update-group-use-case'

let groupsRepository: InMemoryGroupsRepository
let sut: UpdateGroupUseCase

describe('Tabs | Use Case: UpdateGroup', () => {
	beforeEach(() => {
		groupsRepository = new InMemoryGroupsRepository()
		sut = new UpdateGroupUseCase(groupsRepository)
	})

	it('should update the name when the executor is an accepted member', async () => {
		const ownerId = new UniqueEntityId('owner-1')
		const memberId = new UniqueEntityId('member-1')
		const group = makeGroup({
			name: 'Old',
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.accepted(memberId, new Date()),
			],
		})

		await groupsRepository.create(group)

		const { group: updated } = await sut.execute({
			groupId: group.id.toString(),
			userId: 'member-1',
			name: 'New name',
		})

		expect(updated.name).toBe('New name')

		const persisted = await groupsRepository.findById(group.id.toString())

		expect(persisted?.name).toBe('New name')
	})

	it('should not update when the group does not exist', async () => {
		await expect(
			sut.execute({
				groupId: 'missing',
				userId: 'user-1',
				name: 'X',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not update when the executor is only a pending member', async () => {
		const ownerId = new UniqueEntityId('owner-1')
		const pendingId = new UniqueEntityId('pending-1')
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
				userId: 'pending-1',
				name: 'Hacked',
			})
		).rejects.toBeInstanceOf(NotAllowedError)

		const persisted = await groupsRepository.findById(group.id.toString())

		expect(persisted?.name).toBe(group.name)
	})

	it('should not update when the executor is not in the group', async () => {
		const group = makeGroup()

		await groupsRepository.create(group)

		await expect(
			sut.execute({
				groupId: group.id.toString(),
				userId: 'stranger',
				name: 'Hacked',
			})
		).rejects.toBeInstanceOf(NotAllowedError)
	})
})
