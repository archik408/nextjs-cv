// Web Worker to run WASM compression off the main thread

let wasmMod = null;
let wasmReady = false;

async function ensureInit() {
  if (wasmReady) return;
  const loaderUrl = '/wasm/image-compressor/image_compressor.js?v=' + Date.now();
   
  const mod = await import(/* webpackIgnore: true */ loaderUrl);
  await mod.default('/wasm/image-compressor/image_compressor_bg.wasm?v=' + Date.now());
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
      // Новый API - передаем только нужные опции
      const opts = {
        quality: options.quality || 80,
        resize_percent: options.resize_percent || 100,
        aggressive_png: options.aggressive_png || false,
        output_format: options.output_format || "Keep"
      };

      console.log('Worker options:', opts);
      const optsJson = JSON.stringify(opts);
      console.log('Worker JSON:', optsJson);
      
      try {
        out = wasmMod.compress_with_options(bytes, optsJson);
      } catch (compressError) {
        console.error('Compression error:', compressError);
        console.log('Falling back to simple API');
        out = wasmMod.compress_image_quick(bytes, opts.quality);
      }
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


