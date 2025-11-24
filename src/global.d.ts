// Global type declarations for external APIs and browser extensions

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey(): Promise<boolean>;
      openSelectKey(): Promise<void>;
    };
  }
}

// Vite environment variable types
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
