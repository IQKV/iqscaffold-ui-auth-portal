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
  authorities: string[];
  permissions: string[];
  tenantId: string | null;
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

export interface ValidateResetTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  active: boolean;
  tokenId: string | null;
  tokenType: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  user: AuthUser | null;
}

export interface ValidateResetTokenResponse {
  valid: boolean;
  email?: string;
  expiresAt?: string;
}

/**
 * Organization signup types
 */
export interface OrganizationSignupRequest {
  organizationName: string;
  adminUsername: string;
  adminEmail: string;
  adminPassword: string;
  adminFirstName: string;
  adminLastName: string;
  tenantId?: string;
  domain?: string;
}

export interface OrganizationSignupResponse {
  tenantId: string;
  organizationName: string;
  organizationId: number;
  adminUserId: number;
  adminUsername: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  emailVerificationRequired: boolean;
  createdAt: string;
  message: string;
  nextSteps: string;
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
    const response = await apiClient.post<TokenResponse>(config.endpoints.login, credentials);
    return response.data;
  },

  /**
   * Register new user
   */
  async signup(data: UserRegistration): Promise<UserRegistrationResponse> {
    const config = getAuthConfig();
    const response = await apiClient.post<UserRegistrationResponse>(config.endpoints.signup, data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refresh(data: RefreshTokenRequest): Promise<TokenResponse> {
    const config = getAuthConfig();
    const response = await apiClient.post<TokenResponse>(config.endpoints.refresh, data);
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
   * Validate password reset token
   */
  async validateResetToken(token: string): Promise<ValidateResetTokenResponse> {
    const config = getAuthConfig();
    try {
      const _response = await apiClient.head(config.endpoints.resetPassword, {
        params: { token },
      });
      return { valid: true };
    } catch {
      return { valid: false };
    }
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

  /**
   * Validate JWT token
   */
  async validateToken(token: string): Promise<ValidateTokenResponse> {
    const config = getAuthConfig();
    const response = await apiClient.post<ValidateTokenResponse>(config.endpoints.validateToken, {
      token,
    });
    return response.data;
  },

  /**
   * Self-service organization signup
   * Creates a complete tenant environment with organization and admin user
   */
  async signupOrganization(data: OrganizationSignupRequest): Promise<OrganizationSignupResponse> {
    const response = await apiClient.post<OrganizationSignupResponse>("/v1/public/signup", data);
    return response.data;
  },
};
