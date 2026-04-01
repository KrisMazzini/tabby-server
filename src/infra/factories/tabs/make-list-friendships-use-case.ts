import { ListFriendshipsUseCase } from '@/domain/tabs/application/use-cases/list-friendships-use-case'
import { PrismaFriendshipsRepository } from '@/infra/database/prisma/repositories/prisma-friendships-repository'

export function makeListFriendshipsUseCase() {
	const friendshipsRepository = new PrismaFriendshipsRepository()
	return new ListFriendshipsUseCase(friendshipsRepository)
}
