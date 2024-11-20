class CharacterClass {
	class_id: number
	class_name: string
	is_always_invoke: boolean | number
	is_grouping: boolean | number
	max_length: number

	constructor(
		class_id: number,
		class_name: string,
		is_always_invoke: boolean | number,
		is_grouping: boolean | number,
		max_length: number,
	) {
		this.class_id = class_id
		this.class_name = class_name
		this.is_always_invoke = is_always_invoke
		this.is_grouping = is_grouping
		this.max_length = max_length
	}
}

export default CharacterClass
