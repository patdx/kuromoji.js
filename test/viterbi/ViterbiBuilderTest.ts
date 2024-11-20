/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

import { expect } from 'chai'

import DictionaryLoader from '../../src/loader/NodeDictionaryLoader'
import ViterbiBuilder from '../../src/viterbi/ViterbiBuilder'

const DIC_DIR = 'dict/'

describe(
	'ViterbiBuilder',
	{
		timeout: 5 * 60 * 1000, // 5 min
	},
	function () {
		let viterbi_builder: ViterbiBuilder | null = null // target object

		beforeAll(async function () {
			const loader = new DictionaryLoader(DIC_DIR)
			const dic = await loader.load()
			viterbi_builder = new ViterbiBuilder(dic)
		})

		it('Unknown word', function () {
			// lattice to have "ト", "トト", "トトロ"
			const lattice = viterbi_builder!.build('トトロ')
			for (let i = 1; i < lattice.eos_pos; i++) {
				const nodes = lattice.nodes_end_at[i]
				if (nodes == null) {
					continue
				}
				expect(
					nodes.map(function (node) {
						return node.surface_form
					}),
				).to.include('トトロ'.slice(0, i))
			}
		})
	},
)
