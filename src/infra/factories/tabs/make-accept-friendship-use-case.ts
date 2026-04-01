import { AcceptFriendshipUseCase } from '@/domain/tabs/application/use-cases/accept-friendship-use-case'
import { PrismaFriendshipsRepository } from '@/infra/database/prisma/repositories/prisma-friendships-repository'

export function makeAcceptFriendshipUseCase() {
	const friendshipsRepository = new PrismaFriendshipsRepository()
	return new AcceptFriendshipUseCase(friendshipsRepository)
}
