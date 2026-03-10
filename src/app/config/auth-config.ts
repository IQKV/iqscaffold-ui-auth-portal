export interface AuthEndpoints {
  login: string;
  signup: string;
  refresh: string;
  logout: string;
  forgotPassword: string;
  resetPassword: string;
  verifyEmail: string;
  resendVerification: string;
  validateToken: string;
}

export interface AuthConfig {
  endpoints: AuthEndpoints;
  tokenStorage: {
    accessTokenKey: string;
    refreshTokenKey: string;
  };
  redirects: {
    afterLogin: string;
    afterLogout: string;
    afterSignup: string;
  };
  domains: {
    auth: string;
    app: string;
  };
}

// Default hardcoded values (fallbacks)
const DEFAULT_AUTH_DOMAIN = "https://auth.iqscaffold.com";
const DEFAULT_APP_DOMAIN = "https://app.iqscaffold.com";

import { getConfig } from "./runtime-env";

// Build auth configuration from environment variables with fallbacks
const buildAuthConfig = (): AuthConfig => {
  // Prefer runtime window overrides via getConfig, fallback to hard defaults
  const authDomain = getConfig("VITE_AUTH_DOMAIN_AUTH", DEFAULT_AUTH_DOMAIN) as string;
  const appDomain = getConfig("VITE_AUTH_DOMAIN_APP", DEFAULT_APP_DOMAIN) as string;

  return {
    endpoints: {
      login: "/v1/auth/login",
      signup: "/v1/auth/signup",
      refresh: "/v1/auth/refresh",
      logout: "/v1/auth/logout",
      forgotPassword: "/v1/auth/password/forgot",
      resetPassword: "/v1/auth/password/reset",
      verifyEmail: "/v1/auth/email/verify",
      resendVerification: "/v1/auth/email/resend",
      validateToken: "/v1/auth/validate",
    },
    tokenStorage: {
      accessTokenKey: "accessToken",
      refreshTokenKey: "refreshToken",
    },
    redirects: {
      // Always redirect to app domain root after successful login
      afterLogin: getConfig("VITE_AUTH_REDIRECT_AFTER_LOGIN", appDomain) as string,
      // Redirect to auth domain login page after logout
      afterLogout: getConfig("VITE_AUTH_REDIRECT_AFTER_LOGOUT", `${authDomain}/login`) as string,
      // Redirect to auth domain login page after signup
      afterSignup: getConfig("VITE_AUTH_REDIRECT_AFTER_SIGNUP", `${authDomain}/login`) as string,
    },
    domains: {
      auth: authDomain,
      app: appDomain,
    },
  };
};

// Default auth configuration from environment
export const defaultAuthConfig: AuthConfig = buildAuthConfig();

// Allow configuration override
let authConfig: AuthConfig = defaultAuthConfig;

export const configureAuth = (
  config: Partial<AuthConfig> & {
    endpoints?: Partial<AuthEndpoints>;
    tokenStorage?: Partial<AuthConfig["tokenStorage"]>;
    redirects?: Partial<AuthConfig["redirects"]>;
    domains?: Partial<AuthConfig["domains"]>;
  },
) => {
  authConfig = {
    ...authConfig,
    ...config,
    endpoints: {
      ...authConfig.endpoints,
      ...config.endpoints,
    },
    tokenStorage: {
      ...authConfig.tokenStorage,
      ...config.tokenStorage,
    },
    redirects: {
      ...authConfig.redirects,
      ...config.redirects,
    },
    domains: {
      ...authConfig.domains,
      ...config.domains,
    },
  };
};

export const getAuthConfig = (): AuthConfig => authConfig;
