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

import Tokenizer from './Tokenizer'
import { loadDictionary } from './loader/DictionaryLoader'
import type { LoaderConfig } from './loader/types'

export interface TokenizerBuilderOptions {
	loader: LoaderConfig
}

class TokenizerBuilder {
	constructor(public options: TokenizerBuilderOptions) {}

	async build(): Promise<Tokenizer> {
		const dic = await loadDictionary(this.options.loader)
		return new Tokenizer(dic)
	}
}

/**
 * Callback used by build
 * @callback TokenizerBuilder~onLoad
 * @param {Object} err Error object
 * @param {Tokenizer} tokenizer Prepared Tokenizer
 */

export default TokenizerBuilder
