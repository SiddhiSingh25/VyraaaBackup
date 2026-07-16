import * as yup from "yup";
import type { LoginFormValues } from "../../types";

export const loginSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
});
