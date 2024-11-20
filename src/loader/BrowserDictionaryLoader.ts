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

import DictionaryLoader from './DictionaryLoader'

export default class BrowserDictionaryLoader extends DictionaryLoader {
	async loadArrayBuffer(url: string): Promise<ArrayBufferLike> {
		const res = await fetch(url)
		if (!res.ok) {
			throw new Error(`Failed to fetch ${url}, status: ${res.status}`)
		}
		return res.arrayBuffer()
	}
}
