import '@testing-library/jest-dom';

// Mock localStorage per jsdom in Node 22+
try {
  if (!globalThis.localStorage) {
    const store = {};
    globalThis.localStorage = {
      getItem: (key) => store[key] ?? null,
      setItem: (key, value) => { store[key] = String(value); },
      removeItem: (key) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
      get length() { return Object.keys(store).length; },
      key: (i) => Object.keys(store)[i] ?? null,
    };
  }
} catch { /* already defined */ }
