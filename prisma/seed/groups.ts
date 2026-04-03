import { faker } from '@faker-js/faker'
import type { User } from '@/domain/iam/enterprise/entities/user'
import { makeGroup } from '@/domain/tabs/tests/factories/make-group'
import { PrismaGroupsRepository } from '@/infra/database/prisma/repositories/prisma-groups-repository'

export async function seedGroups(users: User[]) {
	if (users.length === 0) {
		return
	}

	const groupsRepository = new PrismaGroupsRepository()

	const groups = users.flatMap(user => {
		return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(
			() => {
				return makeGroup({
					ownerId: user.id,
				})
			}
		)
	})

	return await Promise.all(groups.map(group => groupsRepository.create(group)))
}
