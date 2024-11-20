class ViterbiNode {
	start_pos: number
	length: number
	name: number
	cost: number
	left_id: number
	right_id: number
	prev: ViterbiNode | null
	surface_form: string
	shortest_cost: number
	type: string

	constructor(
		node_name: number,
		node_cost: number,
		start_pos: number,
		length: number,
		type: string,
		left_id: number,
		right_id: number,
		surface_form: string,
	) {
		this.name = node_name
		this.cost = node_cost
		this.start_pos = start_pos
		this.length = length
		this.left_id = left_id
		this.right_id = right_id
		this.prev = null
		this.surface_form = surface_form
		if (type === 'BOS') {
			this.shortest_cost = 0
		} else {
			this.shortest_cost = Number.MAX_VALUE
		}
		this.type = type
	}
}

export default ViterbiNode
