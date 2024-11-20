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
	loadArrayBuffer(
		url: string,
		callback: (err: Error | null, buffer: ArrayBufferLike | null) => void,
	) {
		fetch(url).then(async (res) => {
			if (!res.ok) {
				const err = new Error(res.statusText)
				callback(err, null)
				return
			}
			const arraybuffer = await res.arrayBuffer()
			callback(null, arraybuffer)
		})
	}
}
