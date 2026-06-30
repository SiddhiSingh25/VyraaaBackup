import HomeScreen from '../pages/userPannel/HomeScreen/HomeScreen';
import AboutUs from '../pages/userPannel/AboutUs/AboutUs';
import Wishlist from '../pages/userPannel/Wishlist/Wishlist';


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
];
