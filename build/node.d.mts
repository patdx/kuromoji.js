import { L as LoaderConfig, a as LoaderConfigOptions } from './types-B06SueAI.mjs';

declare class NodeDictionaryLoader implements LoaderConfig {
    options: LoaderConfigOptions;
    constructor(options: LoaderConfigOptions);
    loadArrayBuffer(file: string): Promise<ArrayBufferLike>;
}

export { NodeDictionaryLoader as default };
