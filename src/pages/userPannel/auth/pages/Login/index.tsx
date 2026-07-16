import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";
import { useToast } from "@/hooks/useToast.hook";
import authImage from "@/assets/auth/auth.png";

import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthInput,
  PasswordInput,
  AuthButton,
  SocialButton,
  RememberMe,
  FormDivider,
  PageTransition,
} from "../../components";
import { loginSchema } from "./login.schema";
import type { LoginFormValues } from "../../types";

import { useAppDispatch } from "@/redux/hooks";
import { setCredentials, updateUser } from "@/redux/slices/authSlice";
import useGetQuery from "@/hooks/getQuery.hook";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = (values: LoginFormValues) => {
    postQuery({
      url: apiUrls.Auth.login,
      postData: { email: values.email, password: values.password },
      onSuccess: (res: any) => {
        const token = res?.token;
        const user = res?.user;
        if (token && user) {
          dispatch(setCredentials({ user, token }));
          toast("success", res?.message || "Welcome back!");
          getQuery({
            url: apiUrls.Auth.profile,
            onSuccess: (res: any) => {
              dispatch(updateUser({ user: res?.data}))
            },
            onFail: (err: any) => {
              toast("error", err?.data?.message || err?.message || "Invalid email or password. Please try again.");
            }
          })
          if (user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        } else {
          toast("success", res?.message || "Welcome back!");
          navigate("/");
        }
      },
      onFail: (err: any) => {
        toast("error", err?.data?.message || err?.message || "Invalid email or password. Please try again.");
        console.error(err);
      },
    });
  };

  return (
    <PageTransition>
      <AuthLayout image={authImage} imageAlt="Vyraaa perfume bottle">
        <AuthHeader title="Welcome" highlight="Back" subtitle="Please login to your account" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={<FiMail size={16} />}
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="mb-6 flex items-center justify-between">
            <RememberMe {...register("rememberMe")} />
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Forgot Password?
            </Link>
          </div>

          <AuthButton type="submit" loading={loading}>
            Login
          </AuthButton>




          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link to="/auth/send-otp" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PageTransition>
  );
};

export default Login;
