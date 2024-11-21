# @patdx/kuromoji.js

This is a fork of https://github.com/takuyaa/kuromoji.js

JavaScript implementation of Japanese morphological analyzer.
This is a pure JavaScript porting of [Kuromoji](https://www.atilika.com/ja/kuromoji/).

You can see how kuromoji.js works in [demo site](https://takuyaa.github.io/kuromoji.js/demo/tokenize.html).

My goal is to provide a nice web version of kuromoji.js.

[Available on NPM](https://www.npmjs.com/package/@patdx/kuromoji)

[Web Demo](https://patdx-kuromoji-demo.pages.dev/)

## Changes over the original version

- ESM import only
- Converted to TypeScript and includes TypeScript definitions
- Promises instead of callbacks
- No external dependencies
- Platform agnostic: Browser and Node.js loaders are split into separate import paths.
- Using Fetch instead of XMLHttpRequest for Browser

## Directory

Directory tree is as follows:

    build/
      kuromoji.js -- JavaScript file for browser (Browserified)
    demo/         -- Demo
    dict/         -- Dictionaries for tokenizer (gzipped)
    src/          -- JavaScript source
    test/         -- Unit test

## Usage

You can tokenize sentences with only 5 lines of code.
If you need working examples, you can see the files under the demo or example directory.

### Installation

Install the package:

```sh
npm install @patdx/kuromoji
```

```sh
pnpm install @patdx/kuromoji
```

```sh
yarn add @patdx/kuromoji
```

### Usage in Node.js

The default Node.js loader assumes that the dictionary files are gzip compressed.

It will read and decompress the files.

```ts
import * as kuromoji from '@patdx/kuromoji'
import NodeDictionaryLoader from '@patdx/kuromoji/node'

const tokenizer = await new kuromoji.TokenizerBuilder({
	loader: new NodeDictionaryLoader({
		dicPath: 'node_modules/@patdx/kuromoji/dict/',
	}),
}).build()

// tokenizer is ready
var path = tokenizer.tokenize('すもももももももものうち')
console.log(path)
```

### Use in Browser

Other versions of kuromoji.js don't work so well in the browser because the browser already has its [own mechanism for decompressing files](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding).

To keep things lightweight, we recommend loading the dictionary files from a server that supports returning compressed responses with the `Content-Encoding` header. This way, the app does not need to do any special processing itself.

#### Custom Loader (Recommended)

At the moment, the recommended way to use kuromoji.js in the browser is to use a custom loader as I have not decided how to handle gz vs non-gz. The `loadArrayBuffer` will receive as path name ending in `.dat.gz`, but you'll need to strip it and fetch files that have already been decompressed. The fork `@aiktb/kuromoji` already have uncompressed dict files so we can just load those from jsdelivr CDN.

This beahvior may change in future versions so watch your version number carefully.

Referring to the demo:

https://github.com/patdx/kuromoji.js/blob/main/demo/src/kuromoji.ts

```ts
import * as kuromoji from '@patdx/kuromoji'

const myLoader: kuromoji.LoaderConfig = {
	async loadArrayBuffer(url: string): Promise<ArrayBufferLike> {
		// strip off .gz
		url = url.replace('.gz', '')
		const res = await fetch(
			'https://cdn.jsdelivr.net/npm/@aiktb/kuromoji@1.0.2/dict/' + url,
		)
		if (!res.ok) {
			throw new Error(`Failed to fetch ${url}, status: ${res.status}`)
		}
		return res.arrayBuffer()
	},
}

export const tokenizerPromise = new kuromoji.TokenizerBuilder({
	loader: myLoader,
}).build()
```

#### Built in BrowserDictionaryLoader (Not recommended, experimental)

I can't recommend using this way yet because it is not actually working yet (just a mismatch in compression and file names), but in theory you should be able to do something like this:

```ts
import * as kuromoji from '@patdx/kuromoji'
import BrowserDictionaryLoader from '@patdx/kuromoji/browser'

const tokenizer = await new kuromoji.TokenizerBuilder({
	loader: new BrowserDictionaryLoader({
		dicPath: 'https://cdn.jsdelivr.net/npm/@aiktb/kuromoji@1.0.2/dict/',
	}),
}).build()

// tokenizer is ready
const path = tokenizer.tokenize('すもももももももものうち')
console.log(path)
```

### Custom Loader

Provide your own loader if you want to customize the logic or decompression, etc. See the existing BrowserDictionaryLoader and NodeDictionaryLoader for examples.

## API

The function tokenize() returns an JSON array like this:

    [ {
        word_id: 509800,          // 辞書内での単語ID
        word_type: 'KNOWN',       // 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN)
        word_position: 1,         // 単語の開始位置
        surface_form: '黒文字',    // 表層形
        pos: '名詞',               // 品詞
        pos_detail_1: '一般',      // 品詞細分類1
        pos_detail_2: '*',        // 品詞細分類2
        pos_detail_3: '*',        // 品詞細分類3
        conjugated_type: '*',     // 活用型
        conjugated_form: '*',     // 活用形
        basic_form: '黒文字',      // 基本形
        reading: 'クロモジ',       // 読み
        pronunciation: 'クロモジ'  // 発音
      } ]

(This is defined in src/util/IpadicFormatter.js)

See also [JSDoc page](https://takuyaa.github.io/kuromoji.js/jsdoc/) in details.

## References

Other forks worth looking at:

- https://github.com/MijinkoSD/kuromoji.ts
- https://github.com/sglkc/kuromoji.js/
- https://github.com/aiktb/kuromoji.js

Other notes:

- [Note on using DecompressionStream](https://zenn.dev/inaniwaudon/scraps/dffdc876ccaf6d)
- [About Dictionary Sources](https://www.dampfkraft.com/nlp/japanese-tokenizer-dictionaries.html)
