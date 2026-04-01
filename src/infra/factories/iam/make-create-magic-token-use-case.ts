import { CreateMagicTokenUseCase } from '@/domain/iam/application/use-cases/create-magic-token-use-case'
import { PrismaMagicTokensRepository } from '@/infra/database/prisma/repositories/prisma-magic-tokens-repository'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeCreateMagicTokenUseCase() {
	const usersRepository = new PrismaUsersRepository()
	const magicTokensRepository = new PrismaMagicTokensRepository()

	return new CreateMagicTokenUseCase(usersRepository, magicTokensRepository)
}
