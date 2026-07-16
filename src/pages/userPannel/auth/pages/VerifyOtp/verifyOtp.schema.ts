import * as yup from "yup";
import type { VerifyOtpFormValues } from "../../types";

export const verifyOtpSchema: yup.ObjectSchema<VerifyOtpFormValues> = yup.object({
  email: yup.string().trim().required().email(),
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6}$/, "Enter the complete 6-digit OTP"),
});
