import { L as LoaderConfig, a as LoaderConfigOptions } from './types-B06SueAI.mjs';

declare class BrowserDictionaryLoader implements LoaderConfig {
    options: LoaderConfigOptions;
    constructor(options: LoaderConfigOptions);
    loadArrayBuffer(url: string): Promise<ArrayBufferLike>;
}

export { BrowserDictionaryLoader as default };
