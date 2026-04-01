import { GetUserProfileUseCase } from '@/domain/iam/application/use-cases/get-user-profile-use-case'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeGetUserProfileUseCase() {
	const usersRepository = new PrismaUsersRepository()
	return new GetUserProfileUseCase(usersRepository)
}
