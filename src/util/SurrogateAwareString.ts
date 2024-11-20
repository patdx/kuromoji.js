class SurrogateAwareString {
	length: number
	str: string
	index_mapping: number[]

	constructor(str: string) {
		this.str = str
		this.index_mapping = []

		for (let pos = 0; pos < str.length; pos++) {
			const ch = str.charAt(pos)
			this.index_mapping.push(pos)
			if (SurrogateAwareString.isSurrogatePair(ch)) {
				pos++
			}
		}
		// Surrogate aware length
		this.length = this.index_mapping.length
	}

	slice(index: number) {
		if (this.index_mapping.length <= index) {
			return ''
		}
		const surrogate_aware_index = this.index_mapping[index]
		return this.str.slice(surrogate_aware_index)
	}

	charAt(index: number) {
		if (this.str.length <= index) {
			return ''
		}
		const surrogate_aware_start_index = this.index_mapping[index]
		const surrogate_aware_end_index = this.index_mapping[index + 1]

		if (surrogate_aware_end_index == null) {
			return this.str.slice(surrogate_aware_start_index)
		}
		return this.str.slice(
			surrogate_aware_start_index,
			surrogate_aware_end_index,
		)
	}

	charCodeAt(index: number) {
		if (this.index_mapping.length <= index) {
			return NaN
		}
		const surrogate_aware_index = this.index_mapping[index]
		const upper = this.str.charCodeAt(surrogate_aware_index)
		let lower
		if (
			upper >= 0xd800 &&
			upper <= 0xdbff &&
			surrogate_aware_index < this.str.length
		) {
			lower = this.str.charCodeAt(surrogate_aware_index + 1)
			if (lower >= 0xdc00 && lower <= 0xdfff) {
				return (upper - 0xd800) * 0x400 + lower - 0xdc00 + 0x10000
			}
		}
		return upper
	}

	toString() {
		return this.str
	}

	static isSurrogatePair(ch) {
		const utf16_code = ch.charCodeAt(0)
		if (utf16_code >= 0xd800 && utf16_code <= 0xdbff) {
			// surrogate pair
			return true
		} else {
			return false
		}
	}
}

export default SurrogateAwareString
