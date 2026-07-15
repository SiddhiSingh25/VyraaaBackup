import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import { useToast } from "@/hooks/useToast.hook";

import authImage from "@/assets/auth/auth.png";

import { AuthLayout, AuthHeader, AuthInput, AuthButton, FormDivider, PageTransition } from "../../components";
import { sendOtpSchema } from "./sendOtp.schema";
import type { SendOtpFormValues } from "../../types";

const SendOtp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { postQuery, loading } = usePostQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendOtpFormValues>({
    resolver: yupResolver(sendOtpSchema) as any,
    defaultValues: { email: "" },
  });

  const onSubmit = (values: SendOtpFormValues) => {
    postQuery({
      url: apiUrls.Auth.sendOtp,
      postData: { email: values.email },
      onSuccess: (res: any) => {
        toast("success", res?.message || "OTP sent to your email");
        navigate("/auth/verify-otp", { state: { email: values.email } });
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
        <AuthHeader title="Create" highlight="Account" subtitle="Enter your email to get started" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            icon={<FiMail size={16} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthButton type="submit" loading={loading} className="mt-6 w-full">
            Send OTP
          </AuthButton>

          <FormDivider />

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-semibold text-orange-700 hover:text-orange-800 transition-colors">
              Login
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PageTransition>
  );
};

export default SendOtp;