import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import appRouter from "./routes/appRoute";

const App = () => (
  <>
    <RouterProvider router={appRouter} />
    <Toaster />
  </>
);

export default App;