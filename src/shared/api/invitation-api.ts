import { apiClient } from "./base";

/**
 * Organization preview DTO
 */
export interface OrganizationPreviewDto {
  name: string;
  description: string | null;
  industry: string | null;
  city: string | null;
  country: string | null;
  invitedByUsername: string;
  invitationExpiresAt: string;
}

/**
 * Invitation validation result
 */
export interface InvitationValidationResult {
  valid: boolean;
  message: string;
  organization: OrganizationPreviewDto | null;
}

/**
 * Signup with invitation request
 */
export interface SignupWithInvitationRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  preferredLocale?: string;
}

/**
 * Token response
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Signup with invitation response
 */
export interface SignupWithInvitationResponse {
  userId: number;
  username: string;
  email: string;
  tenantId: string;
  organizationName: string;
  authorities: string[];
  tokens: TokenResponse;
  message: string;
}

/**
 * Public Invitation API
 * No authentication required for these endpoints
 */
export const publicInvitationApi = {
  /**
   * Get organization preview for an invitation
   */
  async previewInvitation(invitationCode: string): Promise<OrganizationPreviewDto> {
    const response = await apiClient.get<OrganizationPreviewDto>(
      `/api/v1/public/invitations/${invitationCode}/preview`,
    );
    return response.data;
  },

  /**
   * Validate an invitation code
   */
  async validateInvitation(invitationCode: string): Promise<InvitationValidationResult> {
    const response = await apiClient.post<InvitationValidationResult>(
      `/api/v1/public/invitations/${invitationCode}/validate`,
    );
    return response.data;
  },

  /**
   * Sign up with an invitation code
   */
  async signupWithInvitation(
    invitationCode: string,
    data: SignupWithInvitationRequest,
  ): Promise<SignupWithInvitationResponse> {
    const response = await apiClient.post<SignupWithInvitationResponse>(
      `/api/v1/public/invitations/${invitationCode}/signup`,
      data,
    );
    return response.data;
  },
};
