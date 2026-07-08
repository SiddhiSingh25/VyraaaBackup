import AdminLayout from "../pages/adminPannel/Layout"
import Dashboard from "../pages/adminPannel/Dashboard"
import AllProduct from "../pages/adminPannel/AllProduct"
import MasterChannel from "../pages/adminPannel/MasterChannel"
import QuickAddProduct from "../pages/adminPannel/AddProduct/QuickAddProduct"


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
        element: <QuickAddProduct/>,
      },
      {
        path: "/admin/master-channel",
        element: <MasterChannel />,
      },
      {
        path: "product/:categorySlug",
        element: <AllProduct/>,
      },]
  }]