import { CreateFriendshipUseCase } from '@/domain/tabs/application/use-cases/create-friendship-use-case'
import { PrismaFriendshipsRepository } from '@/infra/database/prisma/repositories/prisma-friendships-repository'

export function makeCreateFriendshipUseCase() {
	const friendshipsRepository = new PrismaFriendshipsRepository()
	return new CreateFriendshipUseCase(friendshipsRepository)
}
