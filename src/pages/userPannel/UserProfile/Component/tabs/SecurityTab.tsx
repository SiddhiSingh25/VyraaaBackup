import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/pages/userPannel/auth/components";

type SecurityFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const securitySchema: yup.ObjectSchema<SecurityFormValues> = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(3, "New password must be at least 3 characters"),
  confirmNewPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

export function SecurityTab() {
  const { toast } = useToast();
  const { postQuery, loading } = usePostQuery();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SecurityFormValues>({
    resolver: yupResolver(securitySchema) as any,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = (values: SecurityFormValues) => {
    postQuery({
      url: apiUrls.Auth.updatePassword,
      postData: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      onSuccess: () => {
        toast("success", "Password updated successfully");
        reset();
      },
      onFail: (err: any) => {
        toast(
          "error",
          err?.data?.message || err?.message || "Failed to update password"
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <h2 className="font-heading text-lg text-admin-text">Change password</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <PasswordInput
            label="Current password"
              placeholder="Current password"
              disabled={loading}
              error={errors.currentPassword?.message}
              {...register("currentPassword")}
            />
          </div>
          <div />
          <div className="flex flex-col gap-1">
            <PasswordInput
              label="New password"
              placeholder="New password"
              disabled={loading}
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <PasswordInput
            label="Confirm new password"
              placeholder="Confirm new password"
              disabled={loading}
              error={errors.confirmNewPassword?.message}
              {...register("confirmNewPassword")}
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-dark text-background px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}