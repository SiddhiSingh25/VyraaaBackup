
/* =========================
   Auth Pages
========================= */
import Login from "../pages/userPannel/auth/pages/Login";
import SendOtp from "../pages/userPannel/auth/pages/SendOtp";
import VerifyOtp from "../pages/userPannel/auth/pages/VerifyOtp";
import Signup from "../pages/userPannel/auth/pages/Signup";
import ForgotPassword from "../pages/userPannel/auth/pages/ForgotPassword";
import ResetPassword from "../pages/userPannel/auth/pages/ResetPassword";

/* =========================
   User Pages
========================= */
import HomeScreen from "../pages/userPannel/HomeScreen/HomeScreen";
import AboutUs from "../pages/userPannel/AboutUs/AboutUs";
import Wishlist from "../pages/userPannel/Wishlist/Wishlist";
import Profile from "../pages/userPannel/UserProfile/UserProfile";
import ProductDetails from "../pages/userPannel/Product/Product";
import ProductFilter from "../pages/userPannel/ProductFilter/ProductFilter";
import ProtectedRoute from "../components/guards/ProtectedRoute";

/* =========================
   Checkout Pages
========================= */
import CheckoutLayout from "../pages/userPannel/Checkout/CheckoutLayout";
import Cart from "../pages/userPannel/Checkout/Cart/Cart";
import AddNewAddress from "../pages/userPannel/Checkout/Address/pages/AddNewAddress";
import Payment from "../pages/userPannel/Checkout/Payment/PaymentPage";
import OrderDeatils from "../pages/userPannel/OrderDeatils/OrderDeatils";

export const userRoutes = [
  /* =========================
     Authentication
  ========================= */
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/send-otp",
    element: <SendOtp />,
  },
  {
    path: "/auth/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/auth/signup",
    element: <Signup />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/reset-password",
    element: <ResetPassword />,
  },

  /* =========================
     Public
  ========================= */
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/aboutus",
    element: <AboutUs />,
  },

  {
    path: "/aboutus",
    element: <AboutUs />,
  },
  {
    path: "/:id",
    element: <ProductFilter />,
  },
  {
    path: "/:id/:subId",
    element: <ProductFilter />,
  },
  {
    path: "/productDetails/:id",
    element: <ProductDetails />,
  },

  /* =========================
     Protected User Routes
  ========================= */
  {
    element: <ProtectedRoute allowedRoles={["user", "admin"]} />,
    children: [
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/wishlist",
        element: <Wishlist />,
      },
      {
        path: "/orderDeatils",
        element: <OrderDeatils />,
      },
      {
        path: "/checkout",
        element: <CheckoutLayout />,
        children: [
          {
            path: "address",
            element: <AddNewAddress />,
          },
          {
            path: "payment",
            element: <Payment />,
          },
        ],
      },
    ],
  },
];
