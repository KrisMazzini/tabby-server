import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GroupMember } from '../../enterprise/value-objects/group-member'
import { makeGroup } from '../../tests/factories/make-group'
import { InMemoryGroupsRepository } from '../../tests/repositories/in-memory-groups-repository'

import { DeleteGroupUseCase } from './delete-group-use-case'

let groupsRepository: InMemoryGroupsRepository
let sut: DeleteGroupUseCase

describe('Tabs | Use Case: DeleteGroup', () => {
	beforeEach(() => {
		groupsRepository = new InMemoryGroupsRepository()
		sut = new DeleteGroupUseCase(groupsRepository)
	})

	it('should delete the group when the executor is the owner', async () => {
		const ownerId = new UniqueEntityId('owner-1')
		const group = makeGroup({
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.accepted(new UniqueEntityId('member-1'), new Date()),
			],
		})

		await groupsRepository.create(group)

		await sut.execute({
			groupId: group.id.toString(),
			userId: 'owner-1',
		})

		expect(groupsRepository.items).toHaveLength(0)
		expect(await groupsRepository.findById(group.id.toString())).toBeNull()
	})

	it('should not delete when the group does not exist', async () => {
		await expect(
			sut.execute({
				groupId: 'unknown-group',
				userId: 'owner-1',
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not delete when the executor is not the owner', async () => {
		const ownerId = new UniqueEntityId('owner-1')
		const group = makeGroup({
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.accepted(new UniqueEntityId('member-1'), new Date()),
			],
		})

		await groupsRepository.create(group)

		await expect(
			sut.execute({
				groupId: group.id.toString(),
				userId: 'member-1',
			})
		).rejects.toBeInstanceOf(NotAllowedError)

		expect(groupsRepository.items).toHaveLength(1)
	})
})
