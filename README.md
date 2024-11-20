# @patdx/kuromoji.js

This is a fork of https://github.com/takuyaa/kuromoji.js

Other forks worth looking at:

- https://github.com/MijinkoSD/kuromoji.ts
- https://github.com/sglkc/kuromoji.js/
- https://github.com/aiktb/kuromoji.js

Other notes:

- [Note on using DecompressionStream](https://zenn.dev/inaniwaudon/scraps/dffdc876ccaf6d)
- [About Dictionary Sources](https://www.dampfkraft.com/nlp/japanese-tokenizer-dictionaries.html)

My goal is to provide a nice web version of kuromoji.js.

---

JavaScript implementation of Japanese morphological analyzer.
This is a pure JavaScript porting of [Kuromoji](https://www.atilika.com/ja/kuromoji/).

You can see how kuromoji.js works in [demo site](https://takuyaa.github.io/kuromoji.js/demo/tokenize.html).

## Directory

Directory tree is as follows:

    build/
      kuromoji.js -- JavaScript file for browser (Browserified)
    demo/         -- Demo
    dict/         -- Dictionaries for tokenizer (gzipped)
    example/      -- Examples to use in Node.js
    src/          -- JavaScript source
    test/         -- Unit test

## Usage

You can tokenize sentences with only 5 lines of code.
If you need working examples, you can see the files under the demo or example directory.

### Usage for Node.js and Browser

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

You can load the library and tokenizer like this:

```ts
import * as kuromoji from '@patdx/kuromoji'
import NodeDictionaryLoader from '@patdx/kuromoji/node'
import BrowserDictionaryLoader from '@patdx/kuromoji/browser'

// For Node.js:
const tokenizer = await kuromoji
	.builder({
		loader: new NodeDictionaryLoader({ dicPath: 'path/to/dictionary/dir/' }),
	})
	.build()

// For Browser:
const tokenizer = await kuromoji
	.builder({
		loader: new BrowserDictionaryLoader({ dicPath: 'path/to/dictionary/dir/' }),
	})
	.build()

// tokenizer is ready
var path = tokenizer.tokenize('すもももももももものうち')
console.log(path)
```

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

```

```
