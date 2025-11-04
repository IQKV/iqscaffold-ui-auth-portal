const readRuntimeEnv = (key: string): string | undefined => {
  const w: any = typeof window !== "undefined" ? (window as any) : undefined;
  return (w && w[key]) ?? (import.meta as any).env?.[key];
};

const ENV_KEYS = [
  // API base URL
  "VITE_API_URL_SERVER",
  // Auth domain configuration
  "VITE_AUTH_DOMAIN_AUTH",
  "VITE_AUTH_DOMAIN_APP",
  // Auth redirect configuration
  "VITE_AUTH_REDIRECT_AFTER_LOGIN",
  "VITE_AUTH_REDIRECT_AFTER_LOGOUT",
  "VITE_AUTH_REDIRECT_AFTER_SIGNUP",
  // MSW configuration
  "VITE_ENABLE_MSW",
  "VITE_LOG_LEVEL",
] as const;

export const clientBuildEnv: Record<string, string | undefined> =
  Object.fromEntries(ENV_KEYS.map((k) => [k, readRuntimeEnv(k)])) as Record<
    string,
    string | undefined
  >;

export const getConfig = (
  key: string,
  fallback?: string
): string | undefined => {
  return clientBuildEnv[key] ?? fallback;
};
