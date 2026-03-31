import { Entity, type EntityArgs } from '@/core/entities/entity'

import { InvalidDateOfBirthError } from '../../errors/invalid-date-of-birth-error'
import { isValidDateOfBirth } from '../../validators/validate-date-of-birth'

export interface UserProps {
	name: string
	email: string
	dateOfBirth: Date
}

export class User extends Entity<UserProps> {
	get name() {
		return this.props.name
	}

	get email() {
		return this.props.email
	}

	get dateOfBirth() {
		return this.props.dateOfBirth
	}

	set name(name: UserProps['name']) {
		this.props.name = name
		this.touch()
	}

	set email(email: UserProps['email']) {
		this.props.email = email
		this.touch()
	}

	set dateOfBirth(dateOfBirth: UserProps['dateOfBirth']) {
		if (!isValidDateOfBirth(dateOfBirth)) {
			throw new InvalidDateOfBirthError()
		}

		this.props.dateOfBirth = dateOfBirth
		this.touch()
	}

	static create(props: UserProps, args?: EntityArgs) {
		if (!isValidDateOfBirth(props.dateOfBirth)) {
			throw new InvalidDateOfBirthError()
		}

		return new User(props, args)
	}
}
