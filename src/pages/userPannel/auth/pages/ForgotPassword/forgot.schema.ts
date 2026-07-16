import * as yup from "yup";
import type { ForgotPasswordFormValues } from "../../types";

export const forgotPasswordSchema: yup.ObjectSchema<ForgotPasswordFormValues> = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
});
