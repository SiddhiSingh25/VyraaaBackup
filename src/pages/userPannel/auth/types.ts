export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SendOtpFormValues {
  email: string;
}

export interface VerifyOtpFormValues {
  email: string;
  otp: string;
}

export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface VerifyOtpLocationState {
  email: string;
  isReset: boolean
}

export interface SignupLocationState {
  email: string;
  verificationToken: string;
  isReset: boolean
}
