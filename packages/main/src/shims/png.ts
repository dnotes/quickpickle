// PNG shim that works in both browser and Node.js environments
// Uses dynamic imports instead of require()

// Define the PNG constructor type
interface PNGConstructor {
  new (options?: { width?: number; height?: number }): PNGInstance;
  sync: {
    read(data: Buffer): PNGInstance;
    write(png: PNGInstance): Buffer;
  };
}

interface PNGInstance {
  width: number;
  height: number;
  data: Buffer;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// Create a promise that resolves to the PNG constructor
let pngPromise: Promise<PNGConstructor>;

if (isBrowser) {
  // Browser environment - use browser build
  pngPromise = import('pngjs/browser').then(mod => mod.PNG);
} else {
  // Node.js environment - use main build
  pngPromise = import('pngjs').then(mod => mod.PNG);
}

// Cache the PNG constructor once loaded
let cachedPNG: PNGConstructor | null = null;

export async function getPNG(): Promise<PNGConstructor> {
  if (!cachedPNG) {
    cachedPNG = await pngPromise;
  }
  return cachedPNG;
}

