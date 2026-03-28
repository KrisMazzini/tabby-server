import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { assertUniqueUserIds } from './assert-unique-ids'

describe('Utils: Assert Unique IDs', () => {
	it('should return true if the IDs are unique', () => {
		const ids = [
			new UniqueEntityId('1'),
			new UniqueEntityId('2'),
			new UniqueEntityId('3'),
		]

		expect(assertUniqueUserIds(ids)).toBe(true)
	})

	it('should return false if the IDs are not unique', () => {
		const ids = [
			new UniqueEntityId('1'),
			new UniqueEntityId('2'),
			new UniqueEntityId('2'),
		]

		expect(assertUniqueUserIds(ids)).toBe(false)
	})
})
