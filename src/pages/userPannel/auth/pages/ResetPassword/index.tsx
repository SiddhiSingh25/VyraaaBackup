import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import authImage from "@/assets/auth/auth.png";
import usePostQuery from "@/hooks/postQuery.hook";
import { useToast } from "@/hooks/useToast.hook";

import {
  AuthLayout,
  AuthHeader,
  PasswordInput,
  AuthButton,
  PageTransition,
} from "../../components";
import { resetPasswordSchema } from "./reset.schema";
import type { ResetPasswordFormValues } from "../../types";

/**
 * UI only — no API wired yet. Replace onSubmit with a postQuery call once
 * a reset-password endpoint is available.
 */
const ResetPassword = () => {
  const { toast } = useToast();
  const { postQuery, loading } = usePostQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema) as any,
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    toast("success", "Password has been reset successfully (demo)");
    console.log("Reset password submitted (UI only):", values);
  };

  return (
    <PageTransition>
      <AuthLayout image={authImage} imageAlt="Vyraaa perfume bottle">
        <AuthHeader
          title="Reset"
          highlight="Password"
          subtitle="Create a new password for your account"
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <AuthButton type="submit" className="mt-1">
            Reset Password
          </AuthButton>
        </form>
      </AuthLayout>
    </PageTransition>
  );
};

export default ResetPassword;
