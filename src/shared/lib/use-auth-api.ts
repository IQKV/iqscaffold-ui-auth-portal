/**
 * Custom hooks for authentication API operations (Unauthenticated flows only)
 * Provides React Query hooks for public auth endpoints
 *
 * Note: Authenticated user hooks (changePassword, logoutAll, emailStatus)
 * are in the app portal at app.iqscaffold.com
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationService } from "@/shared/lib/notifications";
import { t } from "@lingui/core/macro";
import { authApi } from "@/shared/api";

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
        message: error?.message || t`Failed to verify email. The link may be invalid or expired.`,
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

/**
 * Hook for forgot password
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      notificationService.success({
        title: t`Reset Link Sent`,
        message: t`Please check your email for the password reset link`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Failed to Send Reset Link`,
        message: error?.message || t`Failed to send password reset link`,
      });
    },
  });
}

/**
 * Hook for reset password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      notificationService.success({
        title: t`Password Reset Successful`,
        message: t`Your password has been successfully reset`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Password Reset Failed`,
        message: error?.message || t`Failed to reset password`,
      });
    },
  });
}

/**
 * Hook for user signup/registration
 */
export function useSignup() {
  return useMutation({
    mutationFn: (data: Parameters<typeof authApi.signup>[0]) => authApi.signup(data),
    onSuccess: () => {
      notificationService.success({
        title: t`Registration Successful`,
        message: t`Your account has been created. Please verify your email.`,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Registration Failed`,
        message: error?.message || t`Failed to create account`,
      });
    },
  });
}

/**
 * Hook for organization signup (self-service tenant provisioning)
 */
export function useOrganizationSignup() {
  return useMutation({
    mutationFn: (data: Parameters<typeof authApi.signupOrganization>[0]) =>
      authApi.signupOrganization(data),
    onSuccess: (response) => {
      notificationService.success({
        title: t`Organization Created Successfully`,
        message: response.message,
      });
    },
    onError: (error: any) => {
      notificationService.error({
        title: t`Organization Signup Failed`,
        message: error?.message || t`Failed to create organization`,
      });
    },
  });
}
