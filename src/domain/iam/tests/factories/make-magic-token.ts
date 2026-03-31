import type { EntityArgs } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import {
	MagicToken,
	type MagicTokenProps,
} from '../../enterprise/entities/magic-token'

export function makeMagicToken(
	override: Partial<MagicTokenProps> = {},
	args?: EntityArgs
) {
	return MagicToken.create(
		{
			userId: new UniqueEntityId(),
			...override,
		},
		args
	)
}
