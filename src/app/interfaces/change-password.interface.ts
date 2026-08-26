export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  mustChangePassword: false;
  requiresLogin: true;
}
