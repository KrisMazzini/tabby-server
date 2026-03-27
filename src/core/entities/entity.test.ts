import { Entity, type EntityArgs } from './entity'
import { UniqueEntityId } from './value-objects/unique-entity-id'

interface PersonProps {
	name: string
}

class Person extends Entity<PersonProps> {
	get name() {
		return this.props.name
	}

	static create(props: PersonProps, args?: EntityArgs) {
		const person = new Person(props, args)

		return person
	}
}

describe('Core: Entity', () => {
	it('should be possible to create an Entity', () => {
		const person = Person.create({ name: 'Kris' })

		expect(person.name).toBe('Kris')
		expect(person.id.toString()).toBeTruthy()
	})

	it('should be possible to create an Entity with a given ID', () => {
		const person = Person.create(
			{ name: 'Kris' },
			{ id: new UniqueEntityId('1') }
		)

		expect(person.name).toBe('Kris')
		expect(person.id.toString()).toBe('1')
		expect(person.createdAt).toBeInstanceOf(Date)
		expect(person.updatedAt).toBeUndefined()
	})

	it('should be possible to compare Entities', () => {
		const entity1 = Person.create(
			{ name: 'Kris' },
			{ id: new UniqueEntityId('1') }
		)

		const entity2 = Person.create(
			{ name: 'Kris' },
			{ id: new UniqueEntityId('1') }
		)

		const entity3 = Person.create(
			{ name: 'Kris' },
			{ id: new UniqueEntityId('3') }
		)

		expect(entity1.equals(entity1)).toBe(true)
		expect(entity1.equals(entity2)).toBe(true)
		expect(entity1.equals(entity3)).toBe(false)
	})
})
