import { ListGroupsUseCase } from '@/domain/tabs/application/use-cases/list-groups-use-case'
import { PrismaGroupsRepository } from '@/infra/database/prisma/repositories/prisma-groups-repository'

export function makeListGroupsUseCase() {
	const groupsRepository = new PrismaGroupsRepository()
	return new ListGroupsUseCase(groupsRepository)
}
