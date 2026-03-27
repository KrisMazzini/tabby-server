import { makeCurrency } from '../../tests/factories/make-currency'
import { InMemoryGroupsRepository } from '../../tests/repositories/in-memory-groups-repository'

import { CreateGroupUseCase } from './create-group-use-case'

let groupsRepository: InMemoryGroupsRepository
let sut: CreateGroupUseCase

describe('Tabs | Use Case: CreateGroup', () => {
	beforeEach(() => {
		groupsRepository = new InMemoryGroupsRepository()
		sut = new CreateGroupUseCase(groupsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create a group with the owner as an accepted member', async () => {
		vi.setSystemTime(new Date('2026-03-01T12:00:00.000Z'))

		const defaultCurrency = makeCurrency()

		const { group } = await sut.execute({
			ownerId: 'owner-1',
			defaultCurrency,
			name: 'Trip',
		})

		expect(group.name).toBe('Trip')
		expect(group.defaultCurrency).toEqual(defaultCurrency)
		expect(group.ownerId.toString()).toBe('owner-1')
		expect(group.members).toHaveLength(1)

		const [ownerMember] = group.members

		expect(ownerMember.userId.toString()).toBe('owner-1')
		expect(ownerMember.status).toBe('accepted')
		expect(ownerMember.joinedAt).toEqual(new Date('2026-03-01T12:00:00.000Z'))
		expect(groupsRepository.items).toEqual([group])
	})

	it('should invite additional members', async () => {
		const defaultCurrency = makeCurrency({ iso: 'EUR' })

		const { group } = await sut.execute({
			ownerId: 'owner-1',
			defaultCurrency,
			name: 'Trip',
			inviteeIds: ['user-a', 'user-b'],
		})

		expect(group.members).toHaveLength(3)

		const [owner, ...invited] = group.members

		expect(owner.userId.toString()).toBe('owner-1')
		expect(owner.status).toBe('accepted')

		for (const member of invited) {
			expect(member.status).toBe('pending')
			expect(member.joinedAt).toBeUndefined()
		}

		expect(invited.map(m => m.userId.toString()).sort()).toEqual([
			'user-a',
			'user-b',
		])
	})

	it('should deduplicate member ids and skip the owner if listed', async () => {
		const defaultCurrency = makeCurrency()

		const { group } = await sut.execute({
			ownerId: 'owner-1',
			defaultCurrency,
			name: 'Trip',
			inviteeIds: ['user-a', 'user-a', 'owner-1', 'user-b'],
		})

		expect(group.members).toHaveLength(3)
		expect(group.members.map(m => m.userId.toString()).sort()).toEqual([
			'owner-1',
			'user-a',
			'user-b',
		])

		const [owner, ...invited] = group.members

		expect(owner.userId.toString()).toBe('owner-1')
		expect(owner.status).toBe('accepted')

		for (const member of invited) {
			expect(member.status).toBe('pending')
			expect(member.joinedAt).toBeUndefined()
		}
	})
})
