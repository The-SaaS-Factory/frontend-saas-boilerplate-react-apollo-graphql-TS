import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import {  HelmetProvider } from "react-helmet-async";
function App() {
  return (
    <>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </>
  );
}

export default App;
