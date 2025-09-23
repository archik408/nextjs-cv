// Web Worker to run WASM compression off the main thread

let wasmMod = null;
let wasmReady = false;

async function ensureInit() {
  if (wasmReady) return;
  const loaderUrl = '/wasm/image-compressor/image_compressor.js';
   
  const mod = await import(/* webpackIgnore: true */ loaderUrl);
  await mod.default('/wasm/image-compressor/image_compressor_bg.wasm');
  wasmMod = mod;
  wasmReady = true;
}

self.onmessage = async (e) => {
  const { id, bytes, options } = e.data || {};
  try {
    await ensureInit();
    // notify start
     
    postMessage({ id: 'status', state: 'started' });
    let out;
    if (options) {
      const optsJson = JSON.stringify(options);
      out = wasmMod.compress_with_options(bytes, optsJson);
    } else {
      out = wasmMod.compress_image_quick(bytes, 80);
    }
    // Transfer result back
    const result = new Uint8Array(out);
     
    postMessage({ id, ok: true, result }, [result.buffer]);
     
    postMessage({ id: 'status', state: 'finished' });
  } catch (err) {
     
    postMessage({ id, ok: false, error: String(err && err.message ? err.message : err) });
     
    postMessage({ id: 'status', state: 'finished' });
  }
};


