import { RemoveGroupMemberUseCase } from '@/domain/tabs/application/use-cases/remove-group-member-use-case'
import { PrismaGroupsRepository } from '@/infra/database/prisma/repositories/prisma-groups-repository'

export function makeRemoveGroupMemberUseCase() {
	const groupsRepository = new PrismaGroupsRepository()
	return new RemoveGroupMemberUseCase(groupsRepository)
}
