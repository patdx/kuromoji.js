import { L as LoaderConfig } from './types-B06SueAI.mjs';

declare class ViterbiNode {
    start_pos: number;
    length: number;
    name: number;
    cost: number;
    left_id: number;
    right_id: number;
    prev: ViterbiNode | null;
    surface_form: string;
    shortest_cost: number;
    type: string;
    constructor(node_name: number, node_cost: number, start_pos: number, length: number, type: string, left_id: number, right_id: number, surface_form: string);
}

declare class ViterbiLattice {
    nodes_end_at: ViterbiNode[][];
    eos_pos: number;
    constructor();
    append(node: ViterbiNode): void;
    appendEos(): void;
}

interface KeyValue {
	k: string
	v: number
}

interface BaseAndCheck {
	getBaseBuffer(): any // Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array
	getCheckBuffer(): any // Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array
	loadBaseBuffer(base_buffer: Int8Array): BaseAndCheck
	loadBaseBuffer(base_buffer: Int16Array): BaseAndCheck
	loadBaseBuffer(base_buffer: Int32Array): BaseAndCheck
	loadBaseBuffer(base_buffer: Uint8Array): BaseAndCheck
	loadBaseBuffer(base_buffer: Uint16Array): BaseAndCheck
	loadBaseBuffer(base_buffer: Uint32Array): BaseAndCheck
	loadCheckBuffer(check_buffer: Int8Array): BaseAndCheck
	loadCheckBuffer(check_buffer: Int16Array): BaseAndCheck
	loadCheckBuffer(check_buffer: Int32Array): BaseAndCheck
	loadCheckBuffer(check_buffer: Uint8Array): BaseAndCheck
	loadCheckBuffer(check_buffer: Uint16Array): BaseAndCheck
	loadCheckBuffer(check_buffer: Uint32Array): BaseAndCheck
	size(): number
	getBase(): number
	getCheck(): number
	setBase(index: number, base_value: number): void
	setCheck(index: number, check_value: number): void
	setFirstUnusedNode(index: number): void
	getFirstUnusedNode(): number
	shrink(): void
	calc(): { all: number; unused: number; efficiency: number }
	dump(): string
}

interface DoubleArray {
	bc: BaseAndCheck
	contain(key: string): boolean
	lookup(key: string): number
	commonPrefixSearch(key: string): KeyValue[]
	traverse(parent: number, code: number): number
	size(): number
	calc(): { all: number; unused: number; efficiency: number }
	dump(): string
}

declare class ByteBuffer {
    buffer: Uint8Array;
    position: number;
    constructor(arg?: number | Uint8Array | null);
    size(): number;
    reallocate(): void;
    shrink(): Uint8Array;
    put(b: any): void;
    get(index?: number | null): number;
    putShort(num: any): void;
    getShort(index: any): number;
    putInt(num: any): void;
    getInt(index?: number | null): number;
    readInt(): number;
    putString(str: any): void;
    getString(index?: number | null): string;
}

declare class TokenInfoDictionary {
    dictionary: ByteBuffer;
    target_map: Record<string, number[]>;
    pos_buffer: ByteBuffer;
    constructor();
    buildDictionary(entries: any[][]): {
        [word_id: number]: string;
    };
    put(left_id: number, right_id: number, word_cost: number, surface_form: string, feature: string): number;
    addMapping(source: number, target: number): void;
    targetMapToBuffer(): Uint8Array;
    loadDictionary(array_buffer: Uint8Array): this;
    loadPosVector(array_buffer: Uint8Array): this;
    loadTargetMap(array_buffer: Uint8Array): this;
    getFeatures(token_info_id_str: string): string;
}

declare class ConnectionCosts {
    forward_dimension: number;
    backward_dimension: number;
    buffer: Int16Array;
    constructor(forward_dimension: number, backward_dimension: number);
    put(forward_id: any, backward_id: any, cost: any): void;
    get(forward_id: any, backward_id: any): number;
    loadConnectionCosts(connection_costs_buffer: any): void;
}

declare class CharacterClass {
    class_id: number;
    class_name: string;
    is_always_invoke: boolean | number;
    is_grouping: boolean | number;
    max_length: number;
    constructor(class_id: number, class_name: string, is_always_invoke: boolean | number, is_grouping: boolean | number, max_length: number);
}

declare class InvokeDefinitionMap {
    map: CharacterClass[];
    lookup_table: Record<string, number>;
    constructor();
    init(character_category_definition: CharacterClass[]): void;
    getCharacterClass(class_id: number): CharacterClass;
    lookup(class_name: string): number | null;
    toBuffer(): Uint8Array;
    static load(invoke_def_buffer: Uint8Array): InvokeDefinitionMap;
}

declare class CharacterDefinition {
    character_category_map: Uint8Array;
    compatible_category_map: Uint32Array;
    invoke_definition_map: null | InvokeDefinitionMap;
    constructor();
    initCategoryMappings(category_mapping: any[]): void;
    lookupCompatibleCategory(ch: string): CharacterClass[];
    lookup(ch: string): CharacterClass;
    static load(cat_map_buffer: Uint8Array, compat_cat_map_buffer: Uint32Array, invoke_def_buffer: Uint8Array): CharacterDefinition;
    static parseCharCategory(class_id: any, parsed_category_def: any): CharacterClass | null;
    static parseCategoryMapping(parsed_category_mapping: any): {
        start: number;
        default: any;
        compatible: any;
    };
    static parseRangeCategoryMapping(parsed_category_mapping: any): {
        start: number;
        end: number;
        default: any;
        compatible: any;
    };
}

declare class UnknownDictionary extends TokenInfoDictionary {
    character_definition: null | CharacterDefinition;
    constructor();
    characterDefinition(character_definition: CharacterDefinition): this;
    lookup(ch: string): CharacterClass | undefined;
    lookupCompatibleCategory(ch: string): CharacterClass[] | undefined;
    loadUnknownDictionaries(unk_buffer: Uint8Array, unk_pos_buffer: Uint8Array, unk_map_buffer: Uint8Array, cat_map_buffer: Uint8Array, compat_cat_map_buffer: Uint32Array, invoke_def_buffer: Uint8Array): void;
}

declare class DynamicDictionaries {
    trie: DoubleArray;
    token_info_dictionary: TokenInfoDictionary;
    connection_costs: ConnectionCosts;
    unknown_dictionary: UnknownDictionary;
    constructor(trie?: DoubleArray, token_info_dictionary?: TokenInfoDictionary, connection_costs?: ConnectionCosts, unknown_dictionary?: UnknownDictionary);
    loadTrie(base_buffer: Int32Array, check_buffer: Int32Array): this;
    loadTokenInfoDictionaries(token_info_buffer: Uint8Array, pos_buffer: Uint8Array, target_map_buffer: Uint8Array): this;
    loadConnectionCosts(cc_buffer: Int16Array): this;
    loadUnknownDictionaries(unk_buffer: Uint8Array, unk_pos_buffer: Uint8Array, unk_map_buffer: Uint8Array, cat_map_buffer: Uint8Array, compat_cat_map_buffer: Uint32Array, invoke_def_buffer: Uint8Array): this;
}

declare class ViterbiBuilder {
    trie: DoubleArray;
    token_info_dictionary: TokenInfoDictionary;
    unknown_dictionary: UnknownDictionary;
    constructor(dic: DynamicDictionaries);
    build(sentence_str: string): ViterbiLattice;
}

declare class ViterbiSearcher {
    connection_costs: ConnectionCosts;
    constructor(connection_costs: ConnectionCosts);
    search(lattice: ViterbiLattice): ViterbiNode[];
    forward(lattice: ViterbiLattice): ViterbiLattice;
    backward(lattice: ViterbiLattice): ViterbiNode[];
}

interface IpadicFeatures {
    /** 辞書内での単語ID */
    word_id: number;
    /** 単語タイプ(辞書に登録されている単語ならKNOWN, 未知語ならUNKNOWN) */
    word_type: string;
    /** 単語の開始位置 */
    word_position: number;
    /** 表層形 */
    surface_form: string;
    /** 品詞 */
    pos: string;
    /** 品詞細分類1 */
    pos_detail_1: string;
    /** 品詞細分類2 */
    pos_detail_2: string;
    /** 品詞細分類3 */
    pos_detail_3: string;
    /** 活用型 */
    conjugated_type: string;
    /** 活用形 */
    conjugated_form: string;
    /** 基本形 */
    basic_form: string;
    /** 読み */
    reading?: string | undefined;
    /** 発音 */
    pronunciation?: string | undefined;
}
declare class IpadicFormatter {
    formatEntry(word_id: number, position: number, type: string, features: string[]): IpadicFeatures;
    formatUnknownEntry(word_id: number, position: number, type: string, features: string[], surface_form: string): IpadicFeatures;
}

declare class Tokenizer {
    token_info_dictionary: TokenInfoDictionary;
    unknown_dictionary: UnknownDictionary;
    viterbi_builder: ViterbiBuilder;
    viterbi_searcher: ViterbiSearcher;
    formatter: IpadicFormatter;
    constructor(dic: DynamicDictionaries);
    tokenize(text: string): IpadicFeatures[];
    tokenizeForSentence(sentence: string, tokens: IpadicFeatures[]): IpadicFeatures[];
    getLattice(text: string): ViterbiLattice;
    static splitByPunctuation(input: string): string[];
}

interface TokenizerBuilderOptions {
    loader: LoaderConfig;
}
declare class TokenizerBuilder {
    options: TokenizerBuilderOptions;
    constructor(options: TokenizerBuilderOptions);
    build(): Promise<Tokenizer>;
}

declare class ConnectionCostsBuilder {
    lines: number;
    connection_cost: ConnectionCosts | null;
    constructor();
    putLine(line: string): this;
    build(): ConnectionCosts | null;
}

declare class CharacterDefinitionBuilder {
    char_def: CharacterDefinition;
    character_category_definition: CharacterClass[];
    category_mapping: unknown[];
    constructor();
    putLine(line: string): void;
    build(): CharacterDefinition;
}

declare class DictionaryBuilder {
    tid_entries: string[][];
    unk_entries: string[][];
    cc_builder: ConnectionCostsBuilder;
    cd_builder: CharacterDefinitionBuilder;
    constructor();
    addTokenInfoDictionary(line: string): this;
    putCostMatrixLine(line: string): this;
    putCharDefLine(line: string): this;
    putUnkDefLine(line: string): this;
    build(): DynamicDictionaries;
    buildTokenInfoDictionary(): {
        trie: DoubleArray;
        token_info_dictionary: TokenInfoDictionary;
    };
    buildUnknownDictionary(): UnknownDictionary;
    buildDoubleArray(): DoubleArray;
}

/** @deprecated use new TokenizerBuilder instead */
declare function builder(options: TokenizerBuilderOptions): TokenizerBuilder;
/** @deprecated use new DictionaryBuilder instead */
declare function dictionaryBuilder(): DictionaryBuilder;

export { DictionaryBuilder, type IpadicFeatures, LoaderConfig, TokenizerBuilder, builder, dictionaryBuilder };
