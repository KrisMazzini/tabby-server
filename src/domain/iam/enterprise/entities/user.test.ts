import { InvalidDateOfBirthError } from '../../errors/invalid-date-of-birth-error'

import { User } from './user'

describe('IAM | Entity: User', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2026-03-31T12:00:00.000Z'))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be possible to create an user', () => {
		const user = User.create({
			name: 'Jane Doe',
			email: 'jane@example.com',
			dateOfBirth: new Date('1990-05-15'),
		})

		expect(user.name).toBe('Jane Doe')
		expect(user.email).toBe('jane@example.com')
		expect(user.dateOfBirth).toEqual(new Date('1990-05-15'))
	})

	it('should not be possible to create a user younger than 18 years old', () => {
		expect(() =>
			User.create({
				name: 'Jane',
				email: 'jane@example.com',
				dateOfBirth: new Date('2008-04-01'),
			})
		).toThrow(InvalidDateOfBirthError)
	})
})
