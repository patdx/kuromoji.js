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

import fs from 'fs/promises'
import zlib from 'zlib'
import util from 'node:util'
import DictionaryLoader from './DictionaryLoader'

const gunzip = util.promisify(zlib.gunzip)

class NodeDictionaryLoader extends DictionaryLoader {
	async loadArrayBuffer(file: string): Promise<ArrayBufferLike> {
		const buffer = await fs.readFile(file)
		const decompressed = await gunzip(buffer)
		const typed_array = new Uint8Array(decompressed)
		return typed_array.buffer
	}
}

/**
 * @callback NodeDictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {Uint8Array} buffer Loaded buffer
 */

export default NodeDictionaryLoader
