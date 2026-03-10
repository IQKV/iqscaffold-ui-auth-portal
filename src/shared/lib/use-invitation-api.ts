/**
 * Custom hooks for public invitation API operations
 * Provides React Query hooks for invitation-based signup flow
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { t } from "@lingui/core/macro";
import {
  publicInvitationApi,
  type OrganizationPreviewDto,
  type SignupWithInvitationRequest,
  type SignupWithInvitationResponse,
} from "@/shared/api/invitation-api";

/**
 * Hook for getting invitation preview
 */
export function useInvitationPreview(invitationCode: string, enabled = true) {
  return useQuery<OrganizationPreviewDto>({
    queryKey: ["invitation-preview", invitationCode],
    queryFn: () => publicInvitationApi.previewInvitation(invitationCode),
    enabled: enabled && !!invitationCode,
    retry: false,
  });
}

/**
 * Hook for signing up with an invitation
 */
export function useSignupWithInvitation(invitationCode: string) {
  return useMutation({
    mutationFn: (data: SignupWithInvitationRequest) =>
      publicInvitationApi.signupWithInvitation(invitationCode, data),
    onError: (error: any) => {
      notifications.show({
        title: t`Signup Failed`,
        message: error?.message || t`An error occurred during signup. Please try again.`,
        color: "red",
      });
    },
  });
}
