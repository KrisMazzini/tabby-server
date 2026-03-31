import { Entity, type EntityArgs } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface MagicTokenProps {
	userId: UniqueEntityId
	expiresAt: Date
	validatedAt?: Date | null
}

export class MagicToken extends Entity<MagicTokenProps> {
	static readonly VALIDITY_MS = 5 * 60 * 1000 // 5 minutes

	get userId() {
		return this.props.userId
	}

	get expiresAt() {
		return this.props.expiresAt
	}

	get validatedAt() {
		return this.props.validatedAt ?? null
	}

	isExpired(at: Date = new Date()) {
		return at.getTime() >= this.props.expiresAt.getTime()
	}

	hasBeenValidated() {
		return Boolean(this.props.validatedAt)
	}

	markValidated(at: Date = new Date()) {
		this.props.validatedAt = at
		this.touch()
	}

	static create(
		props: Optional<MagicTokenProps, 'expiresAt'>,
		args?: EntityArgs
	) {
		const expiresAt =
			props.expiresAt ?? new Date(Date.now() + MagicToken.VALIDITY_MS)

		return new MagicToken(
			{
				userId: props.userId,
				expiresAt,
				validatedAt: props.validatedAt ?? null,
			},
			args
		)
	}
}
