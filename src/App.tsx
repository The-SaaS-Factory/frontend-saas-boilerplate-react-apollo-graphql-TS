import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { router } from "./Router";
import { Toaster } from "sonner";
import Loading from "./components/commons/Loading";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

export default function App() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <div>
            <RouterProvider router={router} />
            <Toaster position="top-center" richColors />
          </div>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  );
}
