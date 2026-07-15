import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import appRouter from "./routes/appRoute";

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={appRouter} />
      <Toaster />
    </PersistGate>
  </Provider>
);

export default App;