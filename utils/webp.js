import { defaultOptions } from 'https://cdn.jsdelivr.net/npm/@jsquash/webp@1.4.0/meta.js';
import { initEmscriptenModule } from 'https://cdn.jsdelivr.net/npm/@jsquash/webp@1.4.0/utils.js';
import { simd } from 'https://cdn.jsdelivr.net/npm/wasm-feature-detect@1.6.1/dist/esm/index.js';

let emscriptenModule;

async function init(module, moduleOptionOverrides) {
  if (await simd()) {
    const webpEncoder = await import('https://cdn.jsdelivr.net/npm/@jsquash/webp@1.4.0/codec/enc/webp_enc_simd.js');
    emscriptenModule = initEmscriptenModule(webpEncoder.default, module, moduleOptionOverrides);
    return emscriptenModule;
  }
  const webpEncoder = await import('https://cdn.jsdelivr.net/npm/@jsquash/webp@1.4.0/codec/enc/webp_enc.js');
  emscriptenModule = initEmscriptenModule(webpEncoder.default, module, moduleOptionOverrides);
  return emscriptenModule;
}

export async function encode(data, options = {}) {
  if (!emscriptenModule) {
    emscriptenModule = init();
  }
  const _options = { ...defaultOptions, ...options };
  const mod = await emscriptenModule;
  const result = mod.encode(data.data, data.width, data.height, _options);
  if (!result) {
    throw new Error('Encoding error.');
  }
  return result.buffer;
}
