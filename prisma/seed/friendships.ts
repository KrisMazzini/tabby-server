import { faker } from '@faker-js/faker'

import type { User } from '@/domain/iam/enterprise/entities/user'
import { makeFriendship } from '@/domain/tabs/tests/factories/make-friendship'
import { PrismaFriendshipsRepository } from '@/infra/database/prisma/repositories/prisma-friendships-repository'

export async function seedFriendships(users: User[]) {
	if (users.length < 2) {
		return
	}

	const friendshipsRepository = new PrismaFriendshipsRepository()

	const pairs: [User, User][] = []
	for (let i = 0; i < users.length; i++) {
		for (let j = i + 1; j < users.length; j++) {
			pairs.push([users[i], users[j]])
		}
	}

	faker.helpers.shuffle(pairs)

	const friendships = pairs
		.slice(0, Math.min(30, pairs.length))
		.map(([u1, u2]) => {
			const [fromUser, toUser] = faker.helpers.arrayElement([
				[u1, u2],
				[u2, u1],
			])

			return makeFriendship({
				fromUserId: fromUser.id,
				toUserId: toUser.id,
				status: faker.helpers.arrayElement(['pending', 'accepted']),
			})
		})

	await Promise.all(friendships.map(f => friendshipsRepository.create(f)))
}
