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

import type DynamicDictionaries from '../../src/dict/DynamicDictionaries'
import DictionaryLoader from '../../src/loader/NodeDictionaryLoader'

const DIC_DIR = 'dict/'

describe(
	'DictionaryLoader',
	{
		timeout: 5 * 60 * 1000, // 5 min
	},
	function () {
		let dictionaries: DynamicDictionaries // target object

		beforeAll(async () => {
			const loader = new DictionaryLoader(DIC_DIR)
			dictionaries = await loader.load()
		})

		it('Unknown dictionaries are loaded properly', function () {
			expect(dictionaries.unknown_dictionary.lookup(' ')).to.deep.eql({
				class_id: 1,
				class_name: 'SPACE',
				is_always_invoke: 0,
				is_grouping: 1,
				max_length: 0,
			})
		})
		it('TokenInfoDictionary is loaded properly', function () {
			expect(
				dictionaries.token_info_dictionary.getFeatures('0'),
			).to.have.length.above(1)
		})
	},
)

describe('DictionaryLoader about loading', function () {
	it(
		'could load directory path without suffix /',
		{
			timeout: 5 * 60 * 1000, // 5 min
		},
		async function () {
			const loader = new DictionaryLoader('dict') // not have suffix /
			const dic = await loader.load()
			expect(dic).to.not.be.undefined
		},
	)
	it("couldn't load dictionary, then call with error", async function () {
		const loader = new DictionaryLoader('non-exist/dictionaries')
		const result = await loader.load().catch((err) => err)
		expect(result).to.be.an.instanceof(Error)
	})
})
