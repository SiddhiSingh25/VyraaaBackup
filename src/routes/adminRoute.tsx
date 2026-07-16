import AdminLayout from "../pages/adminPannel/Layout";
import Dashboard from "../pages/adminPannel/Dashboard";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import QuickAddProduct from "../pages/adminPannel/AddProduct/QuickAddProduct";
import Category from '../pages/adminPannel/masterData/Category/Category';
import SubCategory from '../pages/adminPannel/masterData/SubCategory/SubCategory';
import SubCategoryType from '../pages/adminPannel/masterData/SubCategoryType/SubCategoryType';
import ColorFamily from '../pages/adminPannel/masterData/ColorFamily/ColorFamily';
import Color from '../pages/adminPannel/masterData/Color/Color';
import Brand from '../pages/adminPannel/masterData/Brand/Brand';
import SizeType from '../pages/adminPannel/masterData/SizeType/SizeType';
import Size from '../pages/adminPannel/masterData/Size/Size';
import Property from '../pages/adminPannel/masterData/Property/Property';
import PropertyValues from '../pages/adminPannel/masterData/PropertyValues/PropertyValues';






export const adminRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
      {
        index: true,
        element: <QuickAddProduct />,
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
        path: "product/:categorySlug/:categoryId",
        element: <QuickAddProduct />,
      },

      {
        path: "master-channel/category",
        element: <Category />,
      },
      {
        path: "master-channel/subcategory",
        element: <SubCategory />,
      },
      {
        path: "master-channel/subcategory-type",
        element: <SubCategoryType />,
      },
      {
        path: "master-channel/color-family",
        element: <ColorFamily />,
      },
      {
        path: "master-channel/color",
        element: <Color />,
      },
      {
        path: "master-channel/brand",
        element: <Brand />,
      },
      {
        path: "master-channel/size-type",
        element: <SizeType />,
      },
      {
        path: "master-channel/size-values",
        element: <Size />,
      },
      {
        path: "master-channel/property-type",
        element: <Property />,
      },
      {
        path: "master-channel/property-values",
        element: <PropertyValues />,
      },
        ],
      },
    ],
  },
];
