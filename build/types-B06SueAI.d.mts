interface LoaderConfig {
    loadArrayBuffer(url: string): Promise<ArrayBufferLike>;
}
interface LoaderConfigOptions {
    dic_path: string;
}

export type { LoaderConfig as L, LoaderConfigOptions as a };
