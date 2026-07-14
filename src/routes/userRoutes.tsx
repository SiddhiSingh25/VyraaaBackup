import HomeScreen from '../pages/userPannel/HomeScreen/HomeScreen';
import AboutUs from '../pages/userPannel/AboutUs/AboutUs';
import Wishlist from '../pages/userPannel/Wishlist/Wishlist';
import Profile from '../pages/userPannel/UserProfile/UserProfile.tsx';
import ProductDetails from '../pages/userPannel/Product/Product.tsx';
import ProductFilter from '../pages/userPannel/ProductFilter/ProductFilter.tsx';
import AddNewAddress from '../pages/userPannel/Checkout/Address/pages/AddNewAddress.tsx';
import Payment from '../pages/userPannel/Checkout/Payment/PaymentPage.tsx';
import Cart from '../pages/userPannel/Checkout/Cart/Cart.tsx';
import CheckoutLayout from '../pages/userPannel/Checkout/CheckoutLayout.tsx';

export const userRoutes = [
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/aboutus",
    element: <AboutUs />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/productDeatils/:id",
    element: <ProductDetails />,
  },

  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/:category",
    element: <ProductFilter />
  },

  {
    path: "/checkout",
    element: <CheckoutLayout />,
    children: [
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "address",
        element: <AddNewAddress />
      },
      {
        path: "payment",
        element: <Payment />
      },
    ],
  },
];
