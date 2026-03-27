import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import { GroupMember } from '../../enterprise/value-objects/group-member'
import { makeGroup } from '../../tests/factories/make-group'
import { InMemoryGroupsRepository } from '../../tests/repositories/in-memory-groups-repository'

import { ListGroupsUseCase } from './list-groups-use-case'

let groupsRepository: InMemoryGroupsRepository
let sut: ListGroupsUseCase

describe('Tabs | Use Case: ListGroups', () => {
	beforeEach(() => {
		groupsRepository = new InMemoryGroupsRepository()
		sut = new ListGroupsUseCase(groupsRepository)
	})

	it('should list groups the user belongs to', async () => {
		const userId = new UniqueEntityId('alice')
		const otherId = new UniqueEntityId('bob')

		const g1 = makeGroup({
			name: 'Alpha',
			ownerId: userId,
			members: [GroupMember.accepted(userId, new Date())],
		})
		const g2 = makeGroup({
			name: 'Beta',
			ownerId: otherId,
			members: [
				GroupMember.accepted(otherId, new Date()),
				GroupMember.accepted(userId, new Date()),
			],
		})
		const g3 = makeGroup({
			name: 'Gamma',
			ownerId: otherId,
			members: [GroupMember.accepted(otherId, new Date())],
		})

		await groupsRepository.create(g1)
		await groupsRepository.create(g2)
		await groupsRepository.create(g3)

		const { groups, meta } = await sut.execute({ userId: 'alice' })

		expect(groups).toHaveLength(2)
		expect(groups.map(g => g.id.toString()).sort()).toEqual(
			[g1.id.toString(), g2.id.toString()].sort()
		)
		expect(meta).toEqual({
			page: 1,
			size: 20,
			itemCount: 2,
			totalItems: 2,
			totalPages: 1,
		})
	})

	it('should filter by membership status pending', async () => {
		const userId = new UniqueEntityId('alice')
		const ownerId = new UniqueEntityId('owner')

		const invitedOnly = makeGroup({
			name: 'Invited',
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.invite(userId),
			],
		})
		const accepted = makeGroup({
			name: 'Joined',
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.accepted(userId, new Date()),
			],
		})

		await groupsRepository.create(invitedOnly)
		await groupsRepository.create(accepted)

		const { groups, meta } = await sut.execute({
			userId: 'alice',
			filters: { membershipStatus: 'pending' },
		})

		expect(groups).toHaveLength(1)
		expect(meta.totalItems).toBe(1)
		expect(groups[0].id.toString()).toBe(invitedOnly.id.toString())
	})

	it('should filter by membership status accepted', async () => {
		const userId = new UniqueEntityId('alice')
		const ownerId = new UniqueEntityId('owner')

		const invitedOnly = makeGroup({
			name: 'Invited',
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.invite(userId),
			],
		})
		const accepted = makeGroup({
			name: 'Joined',
			ownerId,
			members: [
				GroupMember.accepted(ownerId, new Date()),
				GroupMember.accepted(userId, new Date()),
			],
		})

		await groupsRepository.create(invitedOnly)
		await groupsRepository.create(accepted)

		const { groups, meta } = await sut.execute({
			userId: 'alice',
			filters: { membershipStatus: 'accepted' },
		})

		expect(groups).toHaveLength(1)
		expect(meta.totalItems).toBe(1)
		expect(groups[0].id.toString()).toBe(accepted.id.toString())
	})

	it('should filter by ownership owner', async () => {
		const alice = new UniqueEntityId('alice')
		const bob = new UniqueEntityId('bob')

		const owned = makeGroup({
			name: 'Mine',
			ownerId: alice,
			members: [GroupMember.accepted(alice, new Date())],
		})
		const memberOf = makeGroup({
			name: 'Theirs',
			ownerId: bob,
			members: [
				GroupMember.accepted(bob, new Date()),
				GroupMember.accepted(alice, new Date()),
			],
		})

		await groupsRepository.create(owned)
		await groupsRepository.create(memberOf)

		const { groups, meta } = await sut.execute({
			userId: 'alice',
			filters: { ownership: 'owner' },
		})

		expect(groups).toHaveLength(1)
		expect(meta.totalItems).toBe(1)
		expect(groups[0].id.toString()).toBe(owned.id.toString())
	})

	it('should filter by query substring case-insensitively', async () => {
		const userId = new UniqueEntityId('alice')

		const g1 = makeGroup({
			name: 'Beach Trip 2026',
			ownerId: userId,
			members: [GroupMember.accepted(userId, new Date())],
		})
		const g2 = makeGroup({
			name: 'Office',
			ownerId: userId,
			members: [GroupMember.accepted(userId, new Date())],
		})

		await groupsRepository.create(g1)
		await groupsRepository.create(g2)

		const { groups, meta } = await sut.execute({
			userId: 'alice',
			filters: { q: 'beach' },
		})

		expect(groups).toHaveLength(1)
		expect(meta.totalItems).toBe(1)
		expect(groups[0].name).toBe('Beach Trip 2026')
	})

	it('should combine filters', async () => {
		const alice = new UniqueEntityId('alice')
		const bob = new UniqueEntityId('bob')

		const ownedPending = makeGroup({
			name: 'Trip Alpha',
			ownerId: alice,
			members: [GroupMember.invite(alice)],
		})

		const ownedAccepted = makeGroup({
			name: 'Trip Beta',
			ownerId: alice,
			members: [GroupMember.accepted(alice, new Date())],
		})
		const memberAccepted = makeGroup({
			name: 'Trip Gamma',
			ownerId: bob,
			members: [
				GroupMember.accepted(bob, new Date()),
				GroupMember.accepted(alice, new Date()),
			],
		})

		await groupsRepository.create(ownedPending)
		await groupsRepository.create(ownedAccepted)
		await groupsRepository.create(memberAccepted)

		const { groups, meta } = await sut.execute({
			userId: 'alice',
			filters: {
				ownership: 'owner',
				membershipStatus: 'accepted',
				q: 'trip',
			},
		})

		expect(groups).toHaveLength(1)
		expect(meta.totalItems).toBe(1)
		expect(groups[0].id.toString()).toBe(ownedAccepted.id.toString())
	})

	it('should return an empty list when the user has no groups', async () => {
		const { groups, meta } = await sut.execute({ userId: 'nobody' })

		expect(groups).toEqual([])
		expect(meta).toEqual({
			page: 1,
			size: 20,
			itemCount: 0,
			totalItems: 0,
			totalPages: 0,
		})
	})

	it('should paginate with default page size', async () => {
		const userId = new UniqueEntityId('alice')

		for (let i = 0; i < 25; i++) {
			await groupsRepository.create(
				makeGroup({
					name: `Group ${i}`,
					ownerId: userId,
					members: [GroupMember.accepted(userId, new Date())],
				})
			)
		}

		const first = await sut.execute({ userId: 'alice' })

		expect(first.groups).toHaveLength(20)
		expect(first.meta).toEqual({
			page: 1,
			size: 20,
			itemCount: 20,
			totalItems: 25,
			totalPages: 2,
		})

		const second = await sut.execute({ userId: 'alice', page: 2, size: 20 })

		expect(second.groups).toHaveLength(5)
		expect(second.meta).toEqual({
			page: 2,
			size: 20,
			itemCount: 5,
			totalItems: 25,
			totalPages: 2,
		})
	})

	it('should respect custom page size', async () => {
		const userId = new UniqueEntityId('alice')

		for (let i = 0; i < 5; i++) {
			await groupsRepository.create(
				makeGroup({
					name: `G${i}`,
					ownerId: userId,
					members: [GroupMember.accepted(userId, new Date())],
				})
			)
		}

		const { groups, meta } = await sut.execute({
			userId: 'alice',
			page: 1,
			size: 2,
		})

		expect(groups).toHaveLength(2)
		expect(meta).toEqual({
			page: 1,
			size: 2,
			itemCount: 2,
			totalItems: 5,
			totalPages: 3,
		})
	})
})
