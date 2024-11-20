// src/loader/BrowserDictionaryLoader.ts
var BrowserDictionaryLoader = class {
  constructor(options) {
    this.options = options;
  }
  async loadArrayBuffer(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}, status: ${res.status}`);
    }
    return res.arrayBuffer();
  }
};
export {
  BrowserDictionaryLoader as default
};
