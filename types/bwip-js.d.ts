declare module 'bwip-js' {
  export type ToCanvasOptions = {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: 'left' | 'center' | 'right';
    backgroundcolor?: string;
    [key: string]: unknown;
  };

  export function toCanvas(canvas: HTMLCanvasElement, opts: ToCanvasOptions): void;

  const bwipjs: {
    toCanvas: typeof toCanvas;
  };

  export default bwipjs;
}
