import AdminLayout from "../pages/adminPannel/Layout"
import Dashboard from "../pages/adminPannel/Dashboard"
import AllProduct from "../pages/adminPannel/AllProduct"


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
        path: "product/:categorySlug",
        element: <AllProduct/>,
      },]
  }]