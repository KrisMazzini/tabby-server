import { UpdateGroupUseCase } from '@/domain/tabs/application/use-cases/update-group-use-case'
import { PrismaGroupsRepository } from '@/infra/database/prisma/repositories/prisma-groups-repository'

export function makeUpdateGroupUseCase() {
	const groupsRepository = new PrismaGroupsRepository()
	return new UpdateGroupUseCase(groupsRepository)
}
