import { UseCaseError } from './use-case-error'

export class ResourceNotFoundError extends UseCaseError {
	constructor(resource?: string, code?: string) {
		const message = `${resource ?? 'Resource'} not found.`

		super(message, code ?? 'RESOURCE_NOT_FOUND', 404)
	}
}
