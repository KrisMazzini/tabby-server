import { UniqueEntityId } from './unique-entity-id'

describe('Core: Unique Entity ID', () => {
	it('should be possible to create a Unique Entity ID', () => {
		const uniqueEntityId = new UniqueEntityId('1')
		const randomUniqueEntityId = new UniqueEntityId()

		expect(uniqueEntityId.toString()).toBe('1')
		expect(randomUniqueEntityId.toString()).toBeTruthy()
	})

	it('should be possible to compare Unique Entity IDs', () => {
		const uniqueEntityId1 = new UniqueEntityId('1')
		const uniqueEntityId2 = new UniqueEntityId('1')
		const uniqueEntityId3 = new UniqueEntityId('3')

		expect(uniqueEntityId1.equals(uniqueEntityId1)).toBe(true)
		expect(uniqueEntityId1.equals(uniqueEntityId2)).toBe(true)
		expect(uniqueEntityId1.equals(uniqueEntityId3)).toBe(false)
	})
})
