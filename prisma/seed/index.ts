import { seedFriendships } from './friendships'
import { seedUsers } from './users'

async function main() {
	const users = await seedUsers()
	await seedFriendships(users)
}

main()
