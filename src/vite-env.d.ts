/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BING_MAPS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
