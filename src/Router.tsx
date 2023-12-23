import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./components/layouts/errors/ErrorPage";
import PageLoader from "./components/ui/loaders/PageLoader";
import AdminRoot from "./routes/AdminRoot";
import SuperAdminRoot from "./routes/SuperAdminRoot";
import AdminDashboardPage from "./components/pages/adminPages/AdminDashboardPage";
import AdminSettingPage from "./components/pages/adminPages/AdminSettingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminRoot />, //Landing Root if have frontend app in this project
    errorElement: <ErrorPage />,
    loader: PageLoader,
    children: [
      {
        path: "/about/:id",
        element: <div>about</div>,
      },
    ],
  },
  {
    path: "/home",
    element: <AdminRoot />,
    errorElement: <ErrorPage />,
    loader: PageLoader,
    children: [
      {
        path: "/home/dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "/home/settings",
        element: <AdminSettingPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <SuperAdminRoot />,
    errorElement: <ErrorPage />,
    loader: PageLoader,
    children: [
      {
        path: "/admin/clients",
        element: <div>profile</div>,
      },
    ],
  },
]);
