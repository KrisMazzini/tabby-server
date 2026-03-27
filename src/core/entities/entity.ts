import { UniqueEntityId } from './value-objects/unique-entity-id'

export interface EntityArgs {
	id?: UniqueEntityId
	createdAt?: Date
	updatedAt?: Date
}

export abstract class Entity<Props> {
	private _id: UniqueEntityId
	private _createdAt: Date
	private _updatedAt?: Date
	protected props: Props

	get id() {
		return this._id
	}

	get createdAt() {
		return this._createdAt
	}

	get updatedAt() {
		return this._updatedAt
	}

	protected constructor(props: Props, args: EntityArgs = {}) {
		this._id = args.id ?? new UniqueEntityId()
		this._createdAt = args.createdAt ?? new Date()
		this._updatedAt = args.updatedAt
		this.props = props
	}

	protected touch() {
		this._updatedAt = new Date()
	}

	equals(entity: Entity<unknown>): boolean {
		return entity === this || entity.id.equals(this._id)
	}
}
