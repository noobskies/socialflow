// Global type declarations for external APIs and browser extensions

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey(): Promise<boolean>;
      openSelectKey(): Promise<void>;
    };
  }
}

// Next.js environment variable types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_GEMINI_API_KEY: string;
  }
}

export {};
