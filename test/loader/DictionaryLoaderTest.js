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
import { promisify } from '../../src/util/test-utils'

var DIC_DIR = 'dict/'

describe(
	'DictionaryLoader',
	{
		timeout: 5 * 60 * 1000, // 5 min
	},
	function () {
		var dictionaries = null // target object

		beforeAll(
			promisify(function (done) {
				var loader = new DictionaryLoader(DIC_DIR)
				loader.load(function (err, dic) {
					dictionaries = dic
					done()
				})
			}),
		)

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
		function (done) {
			var loader = new DictionaryLoader('dict') // not have suffix /
			loader.load(function (err, dic) {
				expect(err).to.be.null
				expect(dic).to.not.be.undefined
				done()
			})
		},
	)
	it("couldn't load dictionary, then call with error", async function () {
		await new Promise((resolve) => {
			var loader = new DictionaryLoader('non-exist/dictionaries')
			loader.load(function (err, dic) {
				expect(err).to.be.an.instanceof(Error)
				resolve()
			})
		})
	})
})
