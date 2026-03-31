import { UniqueEntityId } from '@/core/entities/value-objects/unique-entity-id'

import type { UsersRepository } from '../../application/repositories/users-repository'
import type { User } from '../../enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = []

	async create(user: User) {
		this.items.push(user)
	}

	async save(user: User) {
		const index = this.items.findIndex(item => item.id.equals(user.id))
		this.items[index] = user
	}

	async delete(user: User) {
		const index = this.items.findIndex(item => item.id.equals(user.id))
		this.items.splice(index, 1)
	}

	async findById(id: string) {
		const item = this.items.find(item => item.id.equals(new UniqueEntityId(id)))
		return item ?? null
	}

	async findByEmail(email: string) {
		const item = this.items.find(item => item.email === email)
		return item ?? null
	}
}
