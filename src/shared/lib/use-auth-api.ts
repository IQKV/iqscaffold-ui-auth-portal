/**
 * Custom hooks for authentication API operations
 * Provides React Query hooks for all auth endpoints
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationService } from "@/shared/lib/notifications";
import { t } from "@lingui/core/macro";
import { authApi, type EmailStatusResponse } from "@/shared/api";

/**
 * Hook for validating JWT tokens
 */
export function useValidateToken() {
  return useMutation({
    mutationFn: (token: string) => authApi.validateToken(token),
    onError: (error: any) => {
      notificationService.error({
        title: t`Token Validation Failed`,
        message: error?.message || t`Failed to validate token`,
      });
    },
  });
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      notificationService.success({
        title: t`Password Changed`,
        message: t`Your password has been successfully changed`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Password Change Failed`,
        message:
          error?.message ||
          t`Failed to change password. Please check your current password.`,
      });
    },
  });
}

/**
 * Hook for logging out from all devices
 */
export function useLogoutAll() {
  return useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: () => {
      notificationService.success({
        title: t`Logged Out from All Devices`,
        message: t`You have been logged out from all devices`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Logout Failed`,
        message: error?.message || t`Failed to logout from all devices`,
      });
    },
  });
}

/**
 * Hook for getting email verification status
 */
export function useEmailStatus(email: string, enabled = true) {
  return useQuery<EmailStatusResponse>({
    queryKey: ["email-status", email],
    queryFn: () => authApi.getEmailStatus(email),
    enabled: enabled && !!email,
    retry: false,
  });
}

/**
 * Hook for resending verification email
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onSuccess: () => {
      notificationService.success({
        title: t`Verification Email Sent`,
        message: t`Please check your inbox for the verification link`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Failed to Send Email`,
        message: error?.message || t`Failed to send verification email`,
      });
    },
  });
}

/**
 * Hook for verifying email
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      notificationService.success({
        title: t`Email Verified`,
        message: t`Your email has been successfully verified`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Verification Failed`,
        message:
          error?.message ||
          t`Failed to verify email. The link may be invalid or expired.`,
      });
    },
  });
}

/**
 * Hook for validating password reset token
 */
export function useValidateResetToken(token: string | undefined) {
  return useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: () => authApi.validateResetToken(token!),
    enabled: !!token,
    retry: false,
    staleTime: 0,
  });
}

