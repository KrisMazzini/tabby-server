import { CreateGroupUseCase } from '@/domain/tabs/application/use-cases/create-group-use-case'
import { PrismaGroupsRepository } from '@/infra/database/prisma/repositories/prisma-groups-repository'

export function makeCreateGroupUseCase() {
	const groupsRepository = new PrismaGroupsRepository()
	return new CreateGroupUseCase(groupsRepository)
}
