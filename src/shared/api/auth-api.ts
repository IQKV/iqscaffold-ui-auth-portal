import { apiClient } from "./base";
import { getAuthConfig } from "@/app/config";
/**
 * Auth user and registration types are defined locally to avoid cross-layer deps.
 */
export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  tenantId: string;
  emailVerified?: boolean;
  customClaims: Record<string, unknown>;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId?: string;
}

/**
 * Authentication API responses
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface UserRegistrationResponse {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  createdAt: string;
  message: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const config = getAuthConfig();
    const response = await apiClient.post<TokenResponse>(
      config.endpoints.login,
      credentials
    );
    return response.data;
  },

  /**
   * Register new user
   */
  async signup(data: UserRegistration): Promise<UserRegistrationResponse> {
    const config = getAuthConfig();
    const response = await apiClient.post<UserRegistrationResponse>(
      config.endpoints.signup,
      data
    );
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refresh(data: RefreshTokenRequest): Promise<TokenResponse> {
    const config = getAuthConfig();
    const response = await apiClient.post<TokenResponse>(
      config.endpoints.refresh,
      data
    );
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const config = getAuthConfig();
    await apiClient.post(config.endpoints.logout);
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    const config = getAuthConfig();
    await apiClient.post(config.endpoints.forgotPassword, { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const config = getAuthConfig();
    await apiClient.post(config.endpoints.resetPassword, {
      token,
      newPassword,
    });
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    const config = getAuthConfig();
    await apiClient.post(config.endpoints.verifyEmail, { token });
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<void> {
    const config = getAuthConfig();
    await apiClient.post(config.endpoints.resendVerification, { email });
  },
};
