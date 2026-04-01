import { RegisterUseCase } from '@/domain/iam/application/use-cases/register-use-case'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeRegisterUseCase() {
	const usersRepository = new PrismaUsersRepository()
	return new RegisterUseCase(usersRepository)
}
