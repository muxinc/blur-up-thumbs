import initPngModule, { encode as pngEncode } from 'https://cdn.jsdelivr.net/npm/@jsquash/png@3.0.0/codec/pkg/squoosh_png.js';

let pngModule;

export async function init(moduleOrPath) {
  if (!pngModule) {
    pngModule = initPngModule(moduleOrPath);
  }

  return pngModule;
}

export async function encode(data) {
  await init();
  // @ts-ignore - pngEncode expects a Uint8Array, check if mistake or whether we need to convert from Uint8ClampedArray
  const output = await pngEncode(data.data, data.width, data.height);
  if (!output) throw new Error('Encoding error.');

  return output.buffer;
}
