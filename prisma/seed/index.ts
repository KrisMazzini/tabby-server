import { seedExpenses } from './expenses'
import { seedFriendships } from './friendships'
import { seedGroups } from './groups'
import { seedPayments } from './payments'
import { seedUsers } from './users'

async function main() {
	const users = await seedUsers()
	await seedFriendships(users)
	await seedGroups(users)
	await seedPayments(users)
	await seedExpenses(users)
}

main()
