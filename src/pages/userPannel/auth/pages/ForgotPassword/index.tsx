import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import usePostQuery from "@/hooks/postQuery.hook";
import { useToast } from "@/hooks/useToast.hook";

import authImage from "@/assets/auth/auth.png";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthInput,
  AuthButton,
  PageTransition,
} from "../../components";
import { forgotPasswordSchema } from "./forgot.schema";
import type { ForgotPasswordFormValues } from "../../types";
import { apiUrls } from "@/apis";

/**
 * UI only — no API wired yet. Replace onSubmit with a postQuery call once
 * a forgot-password endpoint is available.
 */
const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { postQuery, loading } = usePostQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema) as any,
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    postQuery({
      url: apiUrls.Auth.sendOtp,
      postData: { email: values.email, isReset: true },
      onSuccess: (res: any) => {
        toast("success", res?.message || "OTP sent to your email");
        navigate("/auth/verify-otp", { state: { email: values.email, isReset: true } });
      },
      onFail: (err: any) => {
        toast("error", err?.data?.message || err?.message || "Couldn't send OTP. Please try again.");
        console.error(err);
      },
    });
  };

  return (
    <PageTransition>
      <AuthLayout image={authImage} imageAlt="Vyraaa perfume bottle">
        <Link
          to="/auth/login"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-heading"
        >
          <FiArrowLeft size={14} /> Back
        </Link>

        <AuthHeader
          title="Forgot"
          highlight="Password?"
          subtitle="Enter your email to reset your password"
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            icon={<FiMail size={16} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthButton type="submit" className="mt-1">
            Continue
          </AuthButton>
        </form>
      </AuthLayout>
    </PageTransition>
  );
};

export default ForgotPassword;
