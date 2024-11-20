// src/loader/NodeDictionaryLoader.ts
import fs from "fs/promises";
import zlib from "zlib";
import util from "node:util";
import path from "node:path";
var gunzip = util.promisify(zlib.gunzip);
var NodeDictionaryLoader = class {
  constructor(options) {
    this.options = options;
  }
  async loadArrayBuffer(file) {
    const buffer = await fs.readFile(path.join(this.options.dic_path, file));
    const decompressed = await gunzip(buffer);
    const typed_array = new Uint8Array(decompressed);
    return typed_array.buffer;
  }
};
var NodeDictionaryLoader_default = NodeDictionaryLoader;
export {
  NodeDictionaryLoader_default as default
};
