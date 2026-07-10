import AdminLayout from "../pages/adminPannel/Layout";
import Dashboard from "../pages/adminPannel/Dashboard";
import AllProduct from "../pages/adminPannel/AllProduct";
import MasterChannel from "../pages/adminPannel/MasterChannel";
import QuickAddProduct from "../pages/adminPannel/AddProduct/QuickAddProduct";
import Category from '../pages/adminPannel/masterData/Category/Category';
import SubCategory from '../pages/adminPannel/masterData/SubCategory/SubCategory';
import SubCategoryType from '../pages/adminPannel/masterData/SubCategoryType/SubCategoryType';
import ColorFamily from '../pages/adminPannel/masterData/ColorFamily/ColorFamily';
import Color from '../pages/adminPannel/masterData/Color/Color';
import SizeType from '../pages/adminPannel/masterData/SizeType/SizeType';
import Size from '../pages/adminPannel/masterData/Size/Size';
import Property from '../pages/adminPannel/masterData/Property/Property';
import PropertyValues from '../pages/adminPannel/masterData/PropertyValues/PropertyValues';






export const adminRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin/quick-add",
        element: <QuickAddProduct />,
      },
      {
        path: "/admin/master-channel",
        element: <MasterChannel />,
      },
      {
        path: "product/:categorySlug",
        element: <AllProduct />,
      },

      {
        path: "master-channel/category",
        element: <Category/>,
      },
        {
        path: "master-channel/subcategory",
        element: <SubCategory/>,
      },
      {
        path: "master-channel/subcategory-type",
        element: <SubCategoryType/>,
      },
      {
        path: "master-channel/color-family",
        element: <ColorFamily/>,
      },
      {
        path: "master-channel/color",
        element: <Color/>,
      },
      {
        path: "master-channel/size-type",
        element: <SizeType/>,
      },
      {
        path: "master-channel/size-values",
        element: <Size/>,
      },
      {
        path: "master-channel/property-type",
        element: <Property/>,
      },
      {
        path: "master-channel/property-values",
        element: <PropertyValues/>,
      },
    ],
  },
];
