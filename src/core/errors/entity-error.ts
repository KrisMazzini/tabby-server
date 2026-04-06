export abstract class EntityError extends Error {
	code: string
	httpStatus: number

	constructor(message: string, code: string, httpStatus: number) {
		super(message)
		this.code = code
		this.httpStatus = httpStatus
	}
}
