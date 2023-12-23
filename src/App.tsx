import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";
function App() {
  return (
    <>
      <HelmetProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" expand={true} />
      </HelmetProvider>
    </>
  );
}

export default App;
