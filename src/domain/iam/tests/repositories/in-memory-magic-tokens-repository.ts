import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import type { MagicTokensRepository } from '../../application/repositories/magic-tokens-repository'
import type { MagicToken } from '../../enterprise/entities/magic-token'

export class InMemoryMagicTokensRepository implements MagicTokensRepository {
	public items: MagicToken[] = []

	async create(token: MagicToken) {
		this.items.push(token)
	}

	async save(token: MagicToken) {
		const index = this.items.findIndex(item => item.id.equals(token.id))
		this.items[index] = token
	}

	async findById(id: string) {
		const item = this.items.find(item => item.id.equals(new UniqueEntityId(id)))
		return item ?? null
	}
}
