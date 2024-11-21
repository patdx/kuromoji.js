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

import TokenizerBuilder, {
	type TokenizerBuilderOptions,
} from './TokenizerBuilder'
import DictionaryBuilder from './dict/builder/DictionaryBuilder'

export { TokenizerBuilder, DictionaryBuilder }
export type { LoaderConfig } from './loader/types'
export type { IpadicFeatures } from './util/IpadicFormatter'

/** @deprecated use new TokenizerBuilder instead */
export function builder(options: TokenizerBuilderOptions) {
	return new TokenizerBuilder(options)
}

/** @deprecated use new DictionaryBuilder instead */
export function dictionaryBuilder() {
	return new DictionaryBuilder()
}
