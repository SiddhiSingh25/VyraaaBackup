import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { Loader2 } from "lucide-react";

const inputClasses =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow disabled:opacity-60";

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
            <input
              type="password"
              placeholder="Current password"
              className={`${inputClasses} ${errors.currentPassword ? "border-red-500 focus:ring-red-500" : ""}`}
              disabled={loading}
              {...register("currentPassword")}
            />
            {errors.currentPassword?.message && (
              <span className="text-xs text-red-500 px-1">{errors.currentPassword.message}</span>
            )}
          </div>
          <div />
          <div className="flex flex-col gap-1">
            <input
              type="password"
              placeholder="New password"
              className={`${inputClasses} ${errors.newPassword ? "border-red-500 focus:ring-red-500" : ""}`}
              disabled={loading}
              {...register("newPassword")}
            />
            {errors.newPassword?.message && (
              <span className="text-xs text-red-500 px-1">{errors.newPassword.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="password"
              placeholder="Confirm new password"
              className={`${inputClasses} ${errors.confirmNewPassword ? "border-red-500 focus:ring-red-500" : ""}`}
              disabled={loading}
              {...register("confirmNewPassword")}
            />
            {errors.confirmNewPassword?.message && (
              <span className="text-xs text-red-500 px-1">{errors.confirmNewPassword.message}</span>
            )}
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
