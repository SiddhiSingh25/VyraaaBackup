import { createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./adminRoute";
import { userRoutes } from "./userRoutes";

const appRouter  =  createBrowserRouter([...userRoutes, ...adminRoutes])

export default appRouter