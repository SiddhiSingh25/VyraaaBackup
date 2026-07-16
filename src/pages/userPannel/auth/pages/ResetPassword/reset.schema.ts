import * as yup from "yup";
import type { ResetPasswordFormValues } from "../../types";

export const resetPasswordSchema: yup.ObjectSchema<ResetPasswordFormValues> = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[0-9]/, "Include at least one number"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
