import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import appRouter from "./routes/appRoute";
import { useEffect } from "react";
import useGetQuery from "./hooks/getQuery.hook";
import { apiUrls } from "./apis";
import { setCartItems } from "./redux/slices/cartSlice";



const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={appRouter} />
      <Toaster />
    </PersistGate>
  </Provider>
);

export default App;