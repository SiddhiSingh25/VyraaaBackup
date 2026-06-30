import { RouterProvider } from "react-router-dom";
import appRouter from "./routes/appRoute";


const App = () => <RouterProvider router={appRouter} />;

export default App;