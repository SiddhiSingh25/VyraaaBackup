import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

export const useToast = () => {
  const showToast = (
    type: ToastType,
    message: string,
    options?: ToastOptions
  ) => {
    const { description, duration = 3000 } = options || {};

    switch (type) {
      case "success":
        toast.success(message, {
          description,
          duration,
        });
        break;

      case "error":
        toast.error(message, {
          description,
          duration,
        });
        break;

      case "warning":
        toast.warning(message, {
          description,
          duration,
        });
        break;

      case "info":
        toast.info(message, {
          description,
          duration,
        });
        break;

      case "loading":
        return toast.loading(message, {
          description,
        });

      default:
        toast(message, {
          description,
          duration,
        });
    }
  };

  const dismiss = (id?: string | number) => {
    toast.dismiss(id);
  };

  return {
    toast: showToast,
    dismiss,
  };
};