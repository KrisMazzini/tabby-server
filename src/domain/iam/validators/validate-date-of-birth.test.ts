import { isValidDateOfBirth } from './validate-date-of-birth'

describe('IAM | Validator: isValidDateOfBirth', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should return true if user is at least 18 years old', () => {
		vi.setSystemTime(new Date('2026-03-31T12:00:00.000Z'))
		const dateOfBirth = new Date('2008-03-31T12:00:00.000Z')

		expect(isValidDateOfBirth(dateOfBirth)).toBe(true)
	})

	it('should return false if user is not at least 18 years old', () => {
		vi.setSystemTime(new Date('2026-03-31T12:00:00.000Z'))
		const dateOfBirth = new Date('2008-04-01T12:00:00.000Z')

		expect(isValidDateOfBirth(dateOfBirth)).toBe(false)
	})

	it('should return false if the date of birth is invalid', () => {
		const dateOfBirth = new Date('invalid')
		expect(isValidDateOfBirth(dateOfBirth)).toBe(false)
	})
})
