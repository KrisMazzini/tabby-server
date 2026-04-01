import { AuthenticateByMagicTokenUseCase } from '@/domain/iam/application/use-cases/authenticate-by-magic-token-use-case'
import { PrismaMagicTokensRepository } from '@/infra/database/prisma/repositories/prisma-magic-tokens-repository'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users-repository'

export function makeAuthenticateByMagicTokenUseCase() {
	const magicTokensRepository = new PrismaMagicTokensRepository()
	const usersRepository = new PrismaUsersRepository()

	return new AuthenticateByMagicTokenUseCase(
		magicTokensRepository,
		usersRepository
	)
}
