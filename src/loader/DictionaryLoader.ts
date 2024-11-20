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

import path from 'path'
import DynamicDictionaries from '../dict/DynamicDictionaries'

abstract class DictionaryLoader {
	dic: DynamicDictionaries
	dic_path: string

	constructor(dic_path: string) {
		this.dic = new DynamicDictionaries()
		this.dic_path = dic_path
	}

	loadArrayBuffer(file: string): Promise<ArrayBufferLike> {
		throw new Error('DictionaryLoader#loadArrayBuffer should be overwrite')
	}

	async load(): Promise<DynamicDictionaries> {
		const dic = this.dic
		const dic_path = this.dic_path
		const loadArrayBuffer = this.loadArrayBuffer

		// Trie
		async function loadTrie() {
			const filenames = ['base.dat.gz', 'check.dat.gz']
			const buffers = await Promise.all(
				filenames.map((filename) =>
					loadArrayBuffer(path.join(dic_path, filename)),
				),
			)

			const base_buffer = new Int32Array(buffers[0])
			const check_buffer = new Int32Array(buffers[1])

			dic.loadTrie(base_buffer, check_buffer)
		}
		// Token info dictionaries
		async function loadInfo() {
			const filenames = ['tid.dat.gz', 'tid_pos.dat.gz', 'tid_map.dat.gz']
			const buffers = await Promise.all(
				filenames.map((filename) =>
					loadArrayBuffer(path.join(dic_path, filename)),
				),
			)

			const token_info_buffer = new Uint8Array(buffers[0])
			const pos_buffer = new Uint8Array(buffers[1])
			const target_map_buffer = new Uint8Array(buffers[2])

			dic.loadTokenInfoDictionaries(
				token_info_buffer,
				pos_buffer,
				target_map_buffer,
			)
		}

		// Connection cost matrix
		async function loadCost() {
			const buffer = await loadArrayBuffer(path.join(dic_path, 'cc.dat.gz'))
			const cc_buffer = new Int16Array(buffer)
			dic.loadConnectionCosts(cc_buffer)
		}
		// Unknown dictionaries
		async function loadUnknown() {
			const filenames = [
				'unk.dat.gz',
				'unk_pos.dat.gz',
				'unk_map.dat.gz',
				'unk_char.dat.gz',
				'unk_compat.dat.gz',
				'unk_invoke.dat.gz',
			]
			const buffers = await Promise.all(
				filenames.map((filename) =>
					loadArrayBuffer(path.join(dic_path, filename)),
				),
			)

			const unk_buffer = new Uint8Array(buffers[0])
			const unk_pos_buffer = new Uint8Array(buffers[1])
			const unk_map_buffer = new Uint8Array(buffers[2])
			const cat_map_buffer = new Uint8Array(buffers[3])
			const compat_cat_map_buffer = new Uint32Array(buffers[4])
			const invoke_def_buffer = new Uint8Array(buffers[5])

			dic.loadUnknownDictionaries(
				unk_buffer,
				unk_pos_buffer,
				unk_map_buffer,
				cat_map_buffer,
				compat_cat_map_buffer,
				invoke_def_buffer,
			)
		}

		await Promise.all([loadTrie(), loadInfo(), loadCost(), loadUnknown()])

		return dic
	}
}

/**
 * Callback
 * @callback DictionaryLoader~onLoad
 * @param {Object} err Error object
 * @param {DynamicDictionaries} dic Loaded dictionary
 */

export default DictionaryLoader
