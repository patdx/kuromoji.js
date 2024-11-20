export interface LoaderConfig {
	loadArrayBuffer(url: string): Promise<ArrayBufferLike>
}

export interface LoaderConfigOptions {
	dic_path: string
}
