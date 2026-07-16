import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";


import authImage from "@/assets/auth/auth.png";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  OTPInput,
  AuthButton,
  ResendTimer,
  PageTransition,
} from "../../components";
import { verifyOtpSchema } from "./verifyOtp.schema";
import type { VerifyOtpFormValues, VerifyOtpLocationState } from "../../types";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import { useToast } from "@/hooks/useToast.hook";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { postQuery, loading } = usePostQuery();

  const state = location.state as VerifyOtpLocationState | null;
  const email = state?.email ?? "";
  const isReset = state?.isReset ?? false;

  useEffect(() => {
    if (!email) {
      console.log("errror")
      navigate("/auth/send-otp", { replace: true });
    }
  }, [email, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpFormValues>({
    resolver: yupResolver(verifyOtpSchema) as any,
    defaultValues: { email, otp: "" },
  });

  const onSubmit = (values: VerifyOtpFormValues) => {
    postQuery({
      url: apiUrls.Auth.verifyOtp,
      postData: { email: values.email, otp: Number(values.otp) },
      onSuccess: (res: any) => {
        toast("success", res?.message || "OTP verified successfully.");

        navigate("/auth/signup", {
          state: { email, verificationToken: res.user.verificationToken, isReset },
        });
      },
      onFail: (err: any) => {
        toast("error", err?.data?.message || err?.message || "Invalid or expired OTP. Please try again.");
        console.error(err);
      },
    });
  };

  const handleResend = () => {
    postQuery({
      url: apiUrls.Auth.sendOtp,
      postData: { email },
      onSuccess: (res: any) => toast("success", res?.message || "OTP resent to your email"),
      onFail: (err: any) => toast("error", err?.data?.message || err?.message || "Couldn't resend OTP. Please try again."),
    });
  };

  if (!email) return null;

  return (
    <PageTransition>
      <AuthLayout image={authImage} imageAlt="Vyraaa perfume bottle">
        <Link
          to="/auth/send-otp"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-heading"
        >
          <FiArrowLeft size={14} /> Back
        </Link>

        <AuthHeader
          title="Verify"
          highlight="OTP"
          subtitle={
            <>
              We&apos;ve sent a 6-digit OTP to <span className="font-medium text-heading">{email}</span>
            </>
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-5">
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <OTPInput
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.otp?.message}
                />
              )}
            />
          </div>

          <div className="mb-6">
            <ResendTimer seconds={60} onResend={handleResend} />
          </div>

          <AuthButton type="submit" loading={loading}>
            Verify OTP
          </AuthButton>
        </form>
      </AuthLayout>
    </PageTransition>
  );
};

export default VerifyOtp;
