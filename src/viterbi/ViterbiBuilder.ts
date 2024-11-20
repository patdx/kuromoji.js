/*
 * Copyright 2014 Takuya Asano
 * Copyright 2010-2014 Atilika Inc. and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ViterbiNode from './ViterbiNode'
import ViterbiLattice from './ViterbiLattice'
import SurrogateAwareString from '../util/SurrogateAwareString'
import type DynamicDictionaries from '../dict/DynamicDictionaries'
import type TokenInfoDictionary from '../dict/TokenInfoDictionary'
import type UnknownDictionary from '../dict/UnknownDictionary'

class ViterbiBuilder {
	trie: any
	token_info_dictionary: TokenInfoDictionary
	unknown_dictionary: UnknownDictionary

	constructor(dic: DynamicDictionaries) {
		this.trie = dic.trie
		this.token_info_dictionary = dic.token_info_dictionary
		this.unknown_dictionary = dic.unknown_dictionary
	}

	build(sentence_str: string) {
		const lattice = new ViterbiLattice()
		const sentence = new SurrogateAwareString(sentence_str)

		let key, trie_id, left_id, right_id, word_cost
		for (let pos = 0; pos < sentence.length; pos++) {
			const tail = sentence.slice(pos)
			const vocabulary = this.trie.commonPrefixSearch(tail)
			for (let n = 0; n < vocabulary.length; n++) {
				// Words in dictionary do not have surrogate pair (only UCS2 set)
				trie_id = vocabulary[n].v
				key = vocabulary[n].k

				const token_info_ids = this.token_info_dictionary.target_map[trie_id]
				for (let i = 0; i < token_info_ids.length; i++) {
					const token_info_id = parseInt(token_info_ids[i])

					left_id =
						this.token_info_dictionary.dictionary.getShort(token_info_id)
					right_id = this.token_info_dictionary.dictionary.getShort(
						token_info_id + 2,
					)
					word_cost = this.token_info_dictionary.dictionary.getShort(
						token_info_id + 4,
					)

					// node_name, cost, start_index, length, type, left_id, right_id, surface_form
					lattice.append(
						new ViterbiNode(
							token_info_id,
							word_cost,
							pos + 1,
							key.length,
							'KNOWN',
							left_id,
							right_id,
							key,
						),
					)
				}
			}

			// Unknown word processing
			const surrogate_aware_tail = new SurrogateAwareString(tail)
			const head_char = new SurrogateAwareString(surrogate_aware_tail.charAt(0))
			const head_char_class = this.unknown_dictionary.lookup(
				head_char.toString(),
			)
			if (
				vocabulary == null ||
				vocabulary.length === 0 ||
				head_char_class.is_always_invoke === 1
			) {
				// Process unknown word
				key = head_char
				if (
					head_char_class.is_grouping === 1 &&
					1 < surrogate_aware_tail.length
				) {
					for (let k = 1; k < surrogate_aware_tail.length; k++) {
						const next_char = surrogate_aware_tail.charAt(k)
						const next_char_class = this.unknown_dictionary.lookup(next_char)
						if (head_char_class.class_name !== next_char_class.class_name) {
							break
						}
						key += next_char
					}
				}

				const unk_ids =
					this.unknown_dictionary.target_map[head_char_class.class_id]
				for (let j = 0; j < unk_ids.length; j++) {
					const unk_id = parseInt(unk_ids[j])

					left_id = this.unknown_dictionary.dictionary.getShort(unk_id)
					right_id = this.unknown_dictionary.dictionary.getShort(unk_id + 2)
					word_cost = this.unknown_dictionary.dictionary.getShort(unk_id + 4)

					// node_name, cost, start_index, length, type, left_id, right_id, surface_form
					lattice.append(
						new ViterbiNode(
							unk_id,
							word_cost,
							pos + 1,
							key.length,
							'UNKNOWN',
							left_id,
							right_id,
							key.toString(),
						),
					)
				}
			}
		}
		lattice.appendEos()

		return lattice
	}
}

export default ViterbiBuilder
