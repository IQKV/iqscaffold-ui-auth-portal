export interface SignUpWithInvitationProps {
  invitationCode: string;
}

export interface InvitationStatus {
  isValid: boolean;
  isExpired: boolean;
  isLoading: boolean;
}
