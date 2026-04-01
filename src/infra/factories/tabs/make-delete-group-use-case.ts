import { DeleteGroupUseCase } from '@/domain/tabs/application/use-cases/delete-group-use-case'
import { PrismaGroupsRepository } from '@/infra/database/prisma/repositories/prisma-groups-repository'

export function makeDeleteGroupUseCase() {
	const groupsRepository = new PrismaGroupsRepository()
	return new DeleteGroupUseCase(groupsRepository)
}
