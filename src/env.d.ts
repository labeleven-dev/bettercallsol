interface ImportMetaEnv {
  readonly VITE_SEMVER: string;
  readonly VITE_BUILD: string;
  readonly VITE_BUILD_URL: string;
  readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
