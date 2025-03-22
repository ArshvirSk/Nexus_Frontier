import { Buffer } from 'buffer';

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).process = {
    env: {},
    version: '',
    nextTick: (fn: Function) => setTimeout(fn, 0)
  };
}
