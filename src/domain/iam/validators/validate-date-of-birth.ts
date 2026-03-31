import dayjs from 'dayjs'

export function isValidDateOfBirth(dateOfBirth: Date) {
	if (Number.isNaN(dateOfBirth.getTime())) {
		return false
	}

	return dayjs().diff(dayjs(dateOfBirth), 'years') >= 18
}
