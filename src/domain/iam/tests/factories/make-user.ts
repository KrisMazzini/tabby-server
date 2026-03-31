import { faker } from '@faker-js/faker'

import type { EntityArgs } from '@/core/entities/entity'

import { User, type UserProps } from '../../enterprise/entities/user'

export function makeUser(override: Partial<UserProps> = {}, args?: EntityArgs) {
	return User.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			dateOfBirth: faker.date.past({
				years: 20,
				refDate: new Date('1990-01-01'),
			}),
			...override,
		},
		args
	)
}
