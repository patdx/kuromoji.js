import type ConnectionCosts from '../dict/ConnectionCosts'
import type ViterbiLattice from './ViterbiLattice'
import type ViterbiNode from './ViterbiNode'

class ViterbiSearcher {
	connection_costs: ConnectionCosts

	constructor(connection_costs: ConnectionCosts) {
		this.connection_costs = connection_costs
	}

	search(lattice: ViterbiLattice) {
		lattice = this.forward(lattice)
		return this.backward(lattice)
	}

	forward(lattice: ViterbiLattice) {
		let i, j, k
		for (i = 1; i <= lattice.eos_pos; i++) {
			const nodes = lattice.nodes_end_at[i]
			if (nodes == null) {
				continue
			}
			for (j = 0; j < nodes.length; j++) {
				const node = nodes[j]
				let cost = Number.MAX_VALUE
				let shortest_prev_node: ViterbiNode | null = null

				const prev_nodes = lattice.nodes_end_at[node.start_pos - 1]
				if (prev_nodes == null) {
					// TODO process unknown words (repair word lattice)
					continue
				}
				for (k = 0; k < prev_nodes.length; k++) {
					const prev_node = prev_nodes[k]

					let edge_cost: number
					if (node.left_id == null || prev_node.right_id == null) {
						// TODO assert
						console.log('Left or right is null')
						edge_cost = 0
					} else {
						edge_cost = this.connection_costs.get(
							prev_node.right_id,
							node.left_id,
						)
					}

					const _cost = prev_node.shortest_cost + edge_cost + node.cost
					if (_cost < cost) {
						shortest_prev_node = prev_node
						cost = _cost
					}
				}

				node.prev = shortest_prev_node
				node.shortest_cost = cost
			}
		}
		return lattice
	}

	backward(lattice: ViterbiLattice) {
		const shortest_path = []
		const eos = lattice.nodes_end_at[lattice.nodes_end_at.length - 1][0]

		let node_back = eos.prev
		if (node_back == null) {
			return []
		}
		while (node_back.type !== 'BOS') {
			shortest_path.push(node_back)
			if (node_back.prev == null) {
				// TODO Failed to back. Process unknown words?
				return []
			}
			node_back = node_back.prev
		}

		return shortest_path.reverse()
	}
}

export default ViterbiSearcher
