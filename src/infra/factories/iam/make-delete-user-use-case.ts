import { DeleteUserUseCase } from '@/domain/iam/application/use-cases/delete-user-use-case'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeDeleteUserUseCase() {
	const usersRepository = new PrismaUsersRepository()
	return new DeleteUserUseCase(usersRepository)
}
