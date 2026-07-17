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
import { setCartItems } from "@/redux/slices/cartSlice";
import { setWishlist } from "@/redux/slices/wishlistSlice";
import useGetQuery from "@/hooks/getQuery.hook";
import Navbar from "@/components/Header/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { postQuery, loading } = usePostQuery();
  const { getQuery: getProfileQuery } = useGetQuery();
  const { getQuery: getCartQuery } = useGetQuery();
  const { getQuery: getWishlistQuery } = useGetQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: { email: "", password: "" },
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
          getProfileQuery({
            url: apiUrls.Auth.profile,
            onSuccess: (profileRes: any) => {
              dispatch(updateUser({ user: profileRes?.data }))
            },
            onFail: (err: any) => {
              toast("error", err?.data?.message || err?.message || "Failed to fetch profile info.");
            }
          });
          getCartQuery({
            url: apiUrls.Cart.getByUserId,
            onSuccess: (cartRes: any) => {
              if (cartRes.data && cartRes.data.items) {
                const mappedItems = cartRes.data.items.map((apiItem: any) => {
                  const product = apiItem.product || {};
                  const priceList = product.price || [];
                  const availableSizes = priceList.map((p: any) => p.size).filter(Boolean);

                  return {
                    id: apiItem._id,
                    brand: product.brand || product.manufacturer,
                    name: product.title || "Product",
                    soldBy: "VYRAAA",
                    image: product.image || product.thumbnail || "",
                    size: apiItem.size?.size || availableSizes[0] || "",
                    availableSizes: availableSizes,
                    qty: apiItem.quantity || 1,
                    maxQty: apiItem.maxQty || product.maxQty || 10,
                    mrp: priceList?.[0]?.markupPrice * apiItem.quantity || apiItem.unitPrice || 0,
                    price: apiItem.itemTotal || priceList?.[0]?.amount || 0,
                    returnDays: product.returnDays || 7,
                    selected: true,
                  };
                });
                dispatch(setCartItems(mappedItems));
              }
            },
            onFail: (err: any) => {
              console.error("Failed to fetch cart on login:", err);
            }
          });
          getWishlistQuery({
            url: apiUrls.WishList.getByUserId,
            onSuccess: (wishlistRes: any) => {
              if (wishlistRes.data && wishlistRes.data.items) {
                const mappedItems = wishlistRes.data.items.map((item: any) => {
                  const defaultPrice = (item.product.price && item.product.price.length > 0)
                    ? item.product.price[0]
                    : { amount: 0, markupPrice: null, isAvailable: true };

                  return {
                    id: item.product._id,
                    brand: item.product.brand || "Vyraa",
                    name: item.product.title,
                    image: item.product.image,
                    rating: item.product.rating || 0,
                    price: defaultPrice.amount,
                    originalPrice: defaultPrice.markupPrice,
                    stockStatus: defaultPrice.isAvailable ? "in-stock" : "out-of-stock",
                    colorName: "Standard",
                    colorHex: "#000000",
                    size: "Standard",
                    reviewCount: 0,
                    badge: null,
                  };
                });
                dispatch(setWishlist(mappedItems));
              }
            },
            onFail: (err: any) => {
              console.error("Failed to fetch wishlist on login:", err);
            }
          });
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
      {/* <Navbar /> */}
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
            {/* <RememberMe {...register("rememberMe")} /> */}
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
