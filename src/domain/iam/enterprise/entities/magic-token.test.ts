import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import { MagicToken } from './magic-token'

describe('IAM | Entity: MagicToken', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create a token with default 5 minute validity', () => {
		vi.setSystemTime(new Date('2026-03-31T12:00:00.000Z'))

		const token = MagicToken.create({
			userId: new UniqueEntityId('user-1'),
		})

		expect(token.userId.toString()).toBe('user-1')
		expect(token.validatedAt).toBeNull()
		expect(token.expiresAt).toEqual(new Date('2026-03-31T12:05:00.000Z'))
	})

	it('should mark validated', () => {
		const token = MagicToken.create({
			userId: new UniqueEntityId('user-1'),
			expiresAt: new Date('2026-03-31T12:10:00.000Z'),
		})

		token.markValidated(new Date('2026-03-31T12:01:00.000Z'))

		expect(token.validatedAt).toEqual(new Date('2026-03-31T12:01:00.000Z'))
	})

	it('should be possible to check if the token has been validated', () => {
		const token = MagicToken.create({
			userId: new UniqueEntityId('user-1'),
			expiresAt: new Date('2026-03-31T12:10:00.000Z'),
		})

		expect(token.hasBeenValidated()).toBe(false)

		token.markValidated(new Date('2026-03-31T12:01:00.000Z'))

		expect(token.hasBeenValidated()).toBe(true)
	})

	it('should be possible to check if the token is expired', () => {
		vi.setSystemTime(new Date('2026-03-31T12:00:00.000Z'))

		const expiredToken = MagicToken.create({
			userId: new UniqueEntityId('user-1'),
			expiresAt: new Date('2026-03-31T11:55:00.000Z'),
		})

		const validToken = MagicToken.create({
			userId: new UniqueEntityId('user-1'),
			expiresAt: new Date('2026-03-31T12:05:00.000Z'),
		})

		expect(expiredToken.isExpired()).toBe(true)
		expect(validToken.isExpired()).toBe(false)
	})
})
