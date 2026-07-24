import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail } from "react-icons/fi";

import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import { useToast } from "@/hooks/useToast.hook";
import authImage from "@/assets/auth/auth.png";

import {
  AuthLayout,
  AuthHeader,
  AuthInput,
  PasswordInput,
  AuthButton,
  PageTransition,
} from "../../components";
import { signupSchema, resetPasswordSchema } from "./signup.schema";
import type { SignupFormValues, SignupLocationState } from "../../types";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { postQuery, loading } = usePostQuery();

  const state = location.state as SignupLocationState | null;
  const email = state?.email ?? "";
  const verificationToken = state?.verificationToken ?? "";
  const isReset = state?.isReset ?? false;

  useEffect(() => {
    if (!email || !verificationToken) {
      navigate("/auth/send-otp", { replace: true });
    }
  }, [email, verificationToken, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(isReset ? resetPasswordSchema : signupSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email,
      password: "",
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    postQuery({
      url: apiUrls.Auth.signup,
      postData: isReset ? {
        email: values.email,
        password: values.password,
        verificationToken,
        isReset: true,  // at time of reset
        confirmPassword: values.password
      } : {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        verificationToken,
      },
      onSuccess: (res: any) => {
        toast("success", res?.message || (isReset ? "Password reset successfully." : "Account created successfully."));
        navigate("/auth/login");
      },
      onFail: (err: any) => {
        toast("error", err?.data?.message || err?.message || (isReset ? "Couldn't reset your password. Please try again." : "Couldn't create your account. Please try again."));
        console.error(err);
      },
    });
  };

  if (!email || !verificationToken) return null;

  return (
    <PageTransition>
      <AuthLayout image={authImage} imageAlt="Vyraaa perfume bottle">
        <AuthHeader
          title={isReset ? "Reset" : "Complete Your"}
          highlight={isReset ? "Password" : "Profile"}
          subtitle={isReset ? "Enter your new password to reset it" : "Fill in your details to complete sign up"}
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col space-y-1">

          {isReset ? "" : (<>
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">

              <AuthInput
                label="First Name"
                placeholder="Enter first name"
                icon={<FiUser size={16} className="text-muted-foreground" />}
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <AuthInput
                label="Last Name"
                placeholder="Enter last name"
                icon={<FiUser size={16} className="text-muted-foreground" />}
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>
          </>)
          }

          <AuthInput
            label="Email"
            type="email"
            readOnly
            icon={<FiMail size={16} className="text-muted-foreground" />}
            className="cursor-not-allowed bg-card/80 text-muted opacity-70 transition-opacity"
            {...register("email")}
          />


          <PasswordInput
            label={isReset ? "New Password" : "Password"}
            placeholder={isReset ? "Enter new password" : "Create a password"}
            error={errors.password?.message}
            {...register("password")}
          />

          <AuthButton
            type="submit"
            loading={loading}
            className="mt-4 w-full py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
          >
            {isReset ? "Reset Password" : "Create Account"}
          </AuthButton>

          {!isReset && (
            <p className="mt-2 text-center text-sm leading-relaxed text-muted">
              By signing up, you agree to our{" "}
              <Link
                to="/terms"
                className="font-semibold text-primary transition-colors duration-200 hover:text-primary-dark hover:underline underline-offset-4"
              >
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-semibold text-primary transition-colors duration-200 hover:text-primary-dark hover:underline underline-offset-4"
              >
                Privacy Policy
              </Link>
            </p>
          )}
        </form>
      </AuthLayout>
    </PageTransition>
  );
};

export default Signup;