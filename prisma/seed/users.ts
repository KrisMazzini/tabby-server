import { makeUser } from '@/domain/iam/tests/factories/make-user'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository'

export async function seedUsers() {
	const usersRepository = new PrismaUsersRepository()

	const users = Array.from({ length: 10 }, _ => {
		return makeUser()
	})

	await Promise.all(
		users.map(user => {
			return usersRepository.create(user)
		})
	)

	return users
}
