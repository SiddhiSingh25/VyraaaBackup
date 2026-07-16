import * as yup from "yup";
import type { SendOtpFormValues } from "../../types";

export const sendOtpSchema: yup.ObjectSchema<SendOtpFormValues> = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
});
