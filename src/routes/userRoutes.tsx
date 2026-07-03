import HomeScreen from '../pages/userPannel/HomeScreen/HomeScreen';
import AboutUs from '../pages/userPannel/AboutUs/AboutUs';
import Wishlist from '../pages/userPannel/Wishlist/Wishlist';
import ProductDeatils from '../pages/userPannel/Product/component/ProductDetails';
import Cart from '../pages/userPannel/Cart/Cart.tsx';


export const userRoutes = [
  {
    path: "/",
    element: <HomeScreen/>,
  },
   {
    path: "/aboutus",
    element: <AboutUs/>,
  },
   {
    path: "/wishlist",
    element: <Wishlist/>,
  },
   {
    path: "/productDeatils",
    element: <ProductDeatils/>,
  },
   {
    path: "/cart",
    element : <Cart/>,
  },
];
