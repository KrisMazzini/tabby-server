import { UpdateProfileUseCase } from '@/domain/iam/application/use-cases/update-profile-use-case'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeUpdateProfileUseCase() {
	const usersRepository = new PrismaUsersRepository()
	return new UpdateProfileUseCase(usersRepository)
}
