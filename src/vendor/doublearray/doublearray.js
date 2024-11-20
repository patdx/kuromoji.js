// Copyright (c) 2014 Takuya Asano All Rights Reserved.

const TERM_CHAR = '\u0000', // terminal character
	TERM_CODE = 0, // terminal character code
	ROOT_ID = 0, // index of root node
	NOT_FOUND = -1, // traverse() returns if no nodes found
	BASE_SIGNED = true,
	CHECK_SIGNED = true,
	BASE_BYTES = 4,
	CHECK_BYTES = 4,
	MEMORY_EXPAND_RATIO = 2

const newBC = function (initial_size) {
	if (initial_size == null) {
		initial_size = 1024
	}

	let initBase = function (_base, start, end) {
		// 'end' index does not include
		for (let i = start; i < end; i++) {
			_base[i] = -i + 1 // inversed previous empty node index
		}
		if (0 < check.array[check.array.length - 1]) {
			let last_used_id = check.array.length - 2
			while (0 < check.array[last_used_id]) {
				last_used_id--
			}
			_base[start] = -last_used_id
		}
	}

	let initCheck = function (_check, start, end) {
		for (let i = start; i < end; i++) {
			_check[i] = -i - 1 // inversed next empty node index
		}
	}

	let realloc = function (min_size) {
		// expand arrays size by given ratio
		let new_size = min_size * MEMORY_EXPAND_RATIO
		// console.log('re-allocate memory to ' + new_size);

		let base_new_array = newArrayBuffer(base.signed, base.bytes, new_size)
		initBase(base_new_array, base.array.length, new_size) // init BASE in new range
		base_new_array.set(base.array)
		base.array = null // explicit GC
		base.array = base_new_array

		let check_new_array = newArrayBuffer(check.signed, check.bytes, new_size)
		initCheck(check_new_array, check.array.length, new_size) // init CHECK in new range
		check_new_array.set(check.array)
		check.array = null // explicit GC
		check.array = check_new_array
	}

	let first_unused_node = ROOT_ID + 1

	var base = {
		signed: BASE_SIGNED,
		bytes: BASE_BYTES,
		array: newArrayBuffer(BASE_SIGNED, BASE_BYTES, initial_size),
	}

	var check = {
		signed: CHECK_SIGNED,
		bytes: CHECK_BYTES,
		array: newArrayBuffer(CHECK_SIGNED, CHECK_BYTES, initial_size),
	}

	// init root node
	base.array[ROOT_ID] = 1
	check.array[ROOT_ID] = ROOT_ID

	// init BASE
	initBase(base.array, ROOT_ID + 1, base.array.length)

	// init CHECK
	initCheck(check.array, ROOT_ID + 1, check.array.length)

	return {
		getBaseBuffer: function () {
			return base.array
		},
		getCheckBuffer: function () {
			return check.array
		},
		loadBaseBuffer: function (base_buffer) {
			base.array = base_buffer
			return this
		},
		loadCheckBuffer: function (check_buffer) {
			check.array = check_buffer
			return this
		},
		size: function () {
			return Math.max(base.array.length, check.array.length)
		},
		getBase: function (index) {
			if (base.array.length - 1 < index) {
				return -index + 1
				// realloc(index);
			}
			// if (!Number.isFinite(base.array[index])) {
			//     console.log('getBase:' + index);
			//     throw 'getBase' + index;
			// }
			return base.array[index]
		},
		getCheck: function (index) {
			if (check.array.length - 1 < index) {
				return -index - 1
				// realloc(index);
			}
			// if (!Number.isFinite(check.array[index])) {
			//     console.log('getCheck:' + index);
			//     throw 'getCheck' + index;
			// }
			return check.array[index]
		},
		setBase: function (index, base_value) {
			if (base.array.length - 1 < index) {
				realloc(index)
			}
			base.array[index] = base_value
		},
		setCheck: function (index, check_value) {
			if (check.array.length - 1 < index) {
				realloc(index)
			}
			check.array[index] = check_value
		},
		setFirstUnusedNode: function (index) {
			// if (!Number.isFinite(index)) {
			//     throw 'assertion error: setFirstUnusedNode ' + index + ' is not finite number';
			// }
			first_unused_node = index
		},
		getFirstUnusedNode: function () {
			// if (!Number.isFinite(first_unused_node)) {
			//     throw 'assertion error: getFirstUnusedNode ' + first_unused_node + ' is not finite number';
			// }
			return first_unused_node
		},
		shrink: function () {
			let last_index = this.size() - 1
			while (true) {
				if (0 <= check.array[last_index]) {
					break
				}
				last_index--
			}
			base.array = base.array.subarray(0, last_index + 2) // keep last unused node
			check.array = check.array.subarray(0, last_index + 2) // keep last unused node
		},
		calc: function () {
			let unused_count = 0
			let size = check.array.length
			for (let i = 0; i < size; i++) {
				if (check.array[i] < 0) {
					unused_count++
				}
			}
			return {
				all: size,
				unused: unused_count,
				efficiency: (size - unused_count) / size,
			}
		},
		dump: function () {
			// for debug
			let dump_base = ''
			let dump_check = ''

			let i
			for (i = 0; i < base.array.length; i++) {
				dump_base = dump_base + ' ' + this.getBase(i)
			}
			for (i = 0; i < check.array.length; i++) {
				dump_check = dump_check + ' ' + this.getCheck(i)
			}

			console.log('base:' + dump_base)
			console.log('chck:' + dump_check)

			return 'base:' + dump_base + ' chck:' + dump_check
		},
	}
}

/**
 * Factory method of double array
 */
function DoubleArrayBuilder(initial_size) {
	this.bc = newBC(initial_size) // BASE and CHECK
	this.keys = []
}

/**
 * Append a key to initialize set
 * (This method should be called by dictionary ordered key)
 *
 * @param {String} key
 * @param {Number} value Integer value from 0 to max signed integer number - 1
 */
DoubleArrayBuilder.prototype.append = function (key, record) {
	this.keys.push({ k: key, v: record })
	return this
}

/**
 * Build double array for given keys
 *
 * @param {Array} keys Array of keys. A key is a Object which has properties 'k', 'v'.
 * 'k' is a key string, 'v' is a record assigned to that key.
 * @return {DoubleArray} Compiled double array
 */
DoubleArrayBuilder.prototype.build = function (keys, sorted) {
	if (keys == null) {
		keys = this.keys
	}

	if (keys == null) {
		return new DoubleArray(this.bc)
	}

	if (sorted == null) {
		sorted = false
	}

	// Convert key string to ArrayBuffer
	let buff_keys = keys.map(function (k) {
		return {
			k: stringToUtf8Bytes(k.k + TERM_CHAR),
			v: k.v,
		}
	})

	// Sort keys by byte order
	if (sorted) {
		this.keys = buff_keys
	} else {
		this.keys = buff_keys.sort(function (k1, k2) {
			const b1 = k1.k
			const b2 = k2.k
			const min_length = Math.min(b1.length, b2.length)
			for (let pos = 0; pos < min_length; pos++) {
				if (b1[pos] === b2[pos]) {
					continue
				}
				return b1[pos] - b2[pos]
			}
			return b1.length - b2.length
		})
	}

	buff_keys = null // explicit GC

	this._build(ROOT_ID, 0, 0, this.keys.length)
	return new DoubleArray(this.bc)
}

/**
 * Append nodes to BASE and CHECK array recursively
 */
DoubleArrayBuilder.prototype._build = function (
	parent_index,
	position,
	start,
	length,
) {
	const children_info = this.getChildrenInfo(position, start, length)
	const _base = this.findAllocatableBase(children_info)

	this.setBC(parent_index, children_info, _base)

	for (let i = 0; i < children_info.length; i = i + 3) {
		const child_code = children_info[i]
		if (child_code === TERM_CODE) {
			continue
		}
		const child_start = children_info[i + 1]
		const child_len = children_info[i + 2]
		const child_index = _base + child_code
		this._build(child_index, position + 1, child_start, child_len)
	}
}

DoubleArrayBuilder.prototype.getChildrenInfo = function (
	position,
	start,
	length,
) {
	let current_char = this.keys[start].k[position]
	let i = 0
	let children_info = new Int32Array(length * 3)

	children_info[i++] = current_char // char (current)
	children_info[i++] = start // start index (current)

	let next_pos = start
	let start_pos = start
	for (; next_pos < start + length; next_pos++) {
		const next_char = this.keys[next_pos].k[position]
		if (current_char !== next_char) {
			children_info[i++] = next_pos - start_pos // length (current)

			children_info[i++] = next_char // char (next)
			children_info[i++] = next_pos // start index (next)
			current_char = next_char
			start_pos = next_pos
		}
	}
	children_info[i++] = next_pos - start_pos
	children_info = children_info.subarray(0, i)

	return children_info
}

DoubleArrayBuilder.prototype.setBC = function (
	parent_id,
	children_info,
	_base,
) {
	const bc = this.bc

	bc.setBase(parent_id, _base) // Update BASE of parent node

	let i
	for (i = 0; i < children_info.length; i = i + 3) {
		const code = children_info[i]
		const child_id = _base + code

		// Update linked list of unused nodes

		// Assertion
		// if (child_id < 0) {
		//     throw 'assertion error: child_id is negative'
		// }

		const prev_unused_id = -bc.getBase(child_id)
		const next_unused_id = -bc.getCheck(child_id)
		// if (prev_unused_id < 0) {
		//     throw 'assertion error: setBC'
		// }
		// if (next_unused_id < 0) {
		//     throw 'assertion error: setBC'
		// }
		if (child_id !== bc.getFirstUnusedNode()) {
			bc.setCheck(prev_unused_id, -next_unused_id)
		} else {
			// Update first_unused_node
			bc.setFirstUnusedNode(next_unused_id)
		}
		bc.setBase(next_unused_id, -prev_unused_id)

		const check = parent_id // CHECK is parent node index
		bc.setCheck(child_id, check) // Update CHECK of child node

		// Update record
		if (code === TERM_CODE) {
			const start_pos = children_info[i + 1]
			// var len = children_info[i + 2];
			// if (len != 1) {
			//     throw 'assertion error: there are multiple terminal nodes. len:' + len;
			// }
			let value = this.keys[start_pos].v

			if (value == null) {
				value = 0
			}

			const base = -value - 1 // BASE is inverted record value
			bc.setBase(child_id, base) // Update BASE of child(leaf) node
		}
	}
}

/**
 * Find BASE value that all children are allocatable in double array's region
 */
DoubleArrayBuilder.prototype.findAllocatableBase = function (children_info) {
	const bc = this.bc

	// Assertion: keys are sorted by byte order
	// var c = -1;
	// for (var i = 0; i < children_info.length; i = i + 3) {
	//     if (children_info[i] < c) {
	//         throw 'assertion error: not sort key'
	//     }
	//     c = children_info[i];
	// }

	// iterate linked list of unused nodes
	let _base
	let curr = bc.getFirstUnusedNode() // current index
	// if (curr < 0) {
	//     throw 'assertion error: getFirstUnusedNode returns negative value'
	// }

	while (true) {
		_base = curr - children_info[0]

		if (_base < 0) {
			curr = -bc.getCheck(curr) // next

			// if (curr < 0) {
			//     throw 'assertion error: getCheck returns negative value'
			// }

			continue
		}

		let empty_area_found = true
		for (let i = 0; i < children_info.length; i = i + 3) {
			const code = children_info[i]
			const candidate_id = _base + code

			if (!this.isUnusedNode(candidate_id)) {
				// candidate_id is used node
				// next
				curr = -bc.getCheck(curr)
				// if (curr < 0) {
				//     throw 'assertion error: getCheck returns negative value'
				// }

				empty_area_found = false
				break
			}
		}
		if (empty_area_found) {
			// Area is free
			return _base
		}
	}
}

/**
 * Check this double array index is unused or not
 */
DoubleArrayBuilder.prototype.isUnusedNode = function (index) {
	const bc = this.bc
	const check = bc.getCheck(index)

	// if (index < 0) {
	//     throw 'assertion error: isUnusedNode index:' + index;
	// }

	if (index === ROOT_ID) {
		// root node
		return false
	}
	if (check < 0) {
		// unused
		return true
	}

	// used node (incl. leaf)
	return false
}

/**
 * Factory method of double array
 */
function DoubleArray(bc) {
	this.bc = bc // BASE and CHECK
	this.bc.shrink()
}

/**
 * Look up a given key in this trie
 *
 * @param {String} key
 * @return {Boolean} True if this trie contains a given key
 */
DoubleArray.prototype.contain = function (key) {
	const bc = this.bc

	key += TERM_CHAR
	const buffer = stringToUtf8Bytes(key)

	let parent = ROOT_ID
	let child = NOT_FOUND

	for (let i = 0; i < buffer.length; i++) {
		const code = buffer[i]

		child = this.traverse(parent, code)
		if (child === NOT_FOUND) {
			return false
		}

		if (bc.getBase(child) <= 0) {
			// leaf node
			return true
		} else {
			// not leaf
			parent = child
			continue
		}
	}
	return false
}

/**
 * Look up a given key in this trie
 *
 * @param {String} key
 * @return {Number} Record value assgned to this key, -1 if this key does not contain
 */
DoubleArray.prototype.lookup = function (key) {
	key += TERM_CHAR
	const buffer = stringToUtf8Bytes(key)

	let parent = ROOT_ID
	let child = NOT_FOUND

	for (let i = 0; i < buffer.length; i++) {
		const code = buffer[i]
		child = this.traverse(parent, code)
		if (child === NOT_FOUND) {
			return NOT_FOUND
		}
		parent = child
	}

	const base = this.bc.getBase(child)
	if (base <= 0) {
		// leaf node
		return -base - 1
	} else {
		// not leaf
		return NOT_FOUND
	}
}

/**
 * Common prefix search
 *
 * @param {String} key
 * @return {Array} Each result object has 'k' and 'v' (key and record,
 * respectively) properties assigned to matched string
 */
DoubleArray.prototype.commonPrefixSearch = function (key) {
	const buffer = stringToUtf8Bytes(key)

	let parent = ROOT_ID
	let child = NOT_FOUND

	const result = []

	for (let i = 0; i < buffer.length; i++) {
		const code = buffer[i]

		child = this.traverse(parent, code)

		if (child !== NOT_FOUND) {
			parent = child

			// look forward by terminal character code to check this node is a leaf or not
			const grand_child = this.traverse(child, TERM_CODE)

			if (grand_child !== NOT_FOUND) {
				const base = this.bc.getBase(grand_child)

				const r = {}

				if (base <= 0) {
					// If child is a leaf node, add record to result
					r.v = -base - 1
				}

				// If child is a leaf node, add word to result
				r.k = utf8BytesToString(arrayCopy(buffer, 0, i + 1))

				result.push(r)
			}
			continue
		} else {
			break
		}
	}

	return result
}

DoubleArray.prototype.traverse = function (parent, code) {
	const child = this.bc.getBase(parent) + code
	if (this.bc.getCheck(child) === parent) {
		return child
	} else {
		return NOT_FOUND
	}
}

DoubleArray.prototype.size = function () {
	return this.bc.size()
}

DoubleArray.prototype.calc = function () {
	return this.bc.calc()
}

DoubleArray.prototype.dump = function () {
	return this.bc.dump()
}

// Array utility functions

var newArrayBuffer = function (signed, bytes, size) {
	if (signed) {
		switch (bytes) {
			case 1:
				return new Int8Array(size)
			case 2:
				return new Int16Array(size)
			case 4:
				return new Int32Array(size)
			default:
				throw new RangeError(
					'Invalid newArray parameter element_bytes:' + bytes,
				)
		}
	} else {
		switch (bytes) {
			case 1:
				return new Uint8Array(size)
			case 2:
				return new Uint16Array(size)
			case 4:
				return new Uint32Array(size)
			default:
				throw new RangeError(
					'Invalid newArray parameter element_bytes:' + bytes,
				)
		}
	}
}

var arrayCopy = function (src, src_offset, length) {
	const buffer = new ArrayBuffer(length)
	const dstU8 = new Uint8Array(buffer, 0, length)
	const srcU8 = src.subarray(src_offset, length)
	dstU8.set(srcU8)
	return dstU8
}

/**
 * Convert String (UTF-16) to UTF-8 ArrayBuffer
 *
 * @param {String} str UTF-16 string to convert
 * @return {Uint8Array} Byte sequence encoded by UTF-8
 */
var stringToUtf8Bytes = function (str) {
	// Max size of 1 character is 4 bytes
	const bytes = new Uint8Array(new ArrayBuffer(str.length * 4))

	let i = 0,
		j = 0

	while (i < str.length) {
		var unicode_code

		const utf16_code = str.charCodeAt(i++)
		if (utf16_code >= 0xd800 && utf16_code <= 0xdbff) {
			// surrogate pair
			const upper = utf16_code // high surrogate
			const lower = str.charCodeAt(i++) // low surrogate

			if (lower >= 0xdc00 && lower <= 0xdfff) {
				unicode_code =
					(upper - 0xd800) * (1 << 10) + (1 << 16) + (lower - 0xdc00)
			} else {
				// malformed surrogate pair
				return null
			}
		} else {
			// not surrogate code
			unicode_code = utf16_code
		}

		if (unicode_code < 0x80) {
			// 1-byte
			bytes[j++] = unicode_code
		} else if (unicode_code < 1 << 11) {
			// 2-byte
			bytes[j++] = (unicode_code >>> 6) | 0xc0
			bytes[j++] = (unicode_code & 0x3f) | 0x80
		} else if (unicode_code < 1 << 16) {
			// 3-byte
			bytes[j++] = (unicode_code >>> 12) | 0xe0
			bytes[j++] = ((unicode_code >> 6) & 0x3f) | 0x80
			bytes[j++] = (unicode_code & 0x3f) | 0x80
		} else if (unicode_code < 1 << 21) {
			// 4-byte
			bytes[j++] = (unicode_code >>> 18) | 0xf0
			bytes[j++] = ((unicode_code >> 12) & 0x3f) | 0x80
			bytes[j++] = ((unicode_code >> 6) & 0x3f) | 0x80
			bytes[j++] = (unicode_code & 0x3f) | 0x80
		} else {
			// malformed UCS4 code
		}
	}

	return bytes.subarray(0, j)
}

/**
 * Convert UTF-8 ArrayBuffer to String (UTF-16)
 *
 * @param {Uint8Array} bytes UTF-8 byte sequence to convert
 * @return {String} String encoded by UTF-16
 */
var utf8BytesToString = function (bytes) {
	let str = ''
	let code, b1, b2, b3, b4, upper, lower
	let i = 0

	while (i < bytes.length) {
		b1 = bytes[i++]

		if (b1 < 0x80) {
			// 1 byte
			code = b1
		} else if (b1 >> 5 === 0x06) {
			// 2 bytes
			b2 = bytes[i++]
			code = ((b1 & 0x1f) << 6) | (b2 & 0x3f)
		} else if (b1 >> 4 === 0x0e) {
			// 3 bytes
			b2 = bytes[i++]
			b3 = bytes[i++]
			code = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f)
		} else {
			// 4 bytes
			b2 = bytes[i++]
			b3 = bytes[i++]
			b4 = bytes[i++]
			code =
				((b1 & 0x07) << 18) |
				((b2 & 0x3f) << 12) |
				((b3 & 0x3f) << 6) |
				(b4 & 0x3f)
		}

		if (code < 0x10000) {
			str += String.fromCharCode(code)
		} else {
			// surrogate pair
			code -= 0x10000
			upper = 0xd800 | (code >> 10)
			lower = 0xdc00 | (code & 0x3ff)
			str += String.fromCharCode(upper, lower)
		}
	}

	return str
}

// public methods

export function builder(initial_size) {
	return new DoubleArrayBuilder(initial_size)
}
export function load(base_buffer, check_buffer) {
	let bc = newBC(0)
	bc.loadBaseBuffer(base_buffer)
	bc.loadCheckBuffer(check_buffer)
	return new DoubleArray(bc)
}
