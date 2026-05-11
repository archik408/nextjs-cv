declare module 'js-sha3' {
  export type ShakeBits = 128 | 256;
  export type ShakeOutputBits = number;

  type HasherWithArrayBuffer = {
    arrayBuffer(message: string | ArrayBuffer | Uint8Array): ArrayBuffer;
  };

  type ShakeWithArrayBuffer = {
    arrayBuffer(
      message: string | ArrayBuffer | Uint8Array,
      outputBits: ShakeOutputBits
    ): ArrayBuffer;
  };

  export const sha3_256: HasherWithArrayBuffer;
  export const shake128: ShakeWithArrayBuffer;
}
