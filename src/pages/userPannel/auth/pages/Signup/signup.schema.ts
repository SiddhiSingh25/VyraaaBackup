import * as yup from "yup";
import type { SignupFormValues } from "../../types";

export const signupSchema: yup.ObjectSchema<SignupFormValues> = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  email: yup.string().trim().required().email(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[0-9]/, "Include at least one number")
});

export const resetPasswordSchema: yup.ObjectSchema<SignupFormValues> = yup.object({
  firstName: yup.string().notRequired() as any,
  lastName: yup.string().notRequired() as any,
  email: yup.string().trim().required().email(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Include at least one uppercase letter")
    .matches(/[0-9]/, "Include at least one number")
});
