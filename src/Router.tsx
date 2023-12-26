import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./components/layouts/errors/ErrorPage";
import PageLoader from "./components/ui/loaders/PageLoader";
import AdminRoot from "./routes/AdminRoot";
import SuperAdminRoot from "./routes/SuperAdminRoot";
import AdminDashboardPage from "./components/pages/adminPages/AdminDashboardPage";
import AdminSettingPage from "./components/pages/adminPages/AdminSettingPage";
import ForbiddenPage from "./components/layouts/errors/ForbiddenPage";
import SuperAdminSettingPage from "./components/pages/superAdminPages/superAdminSettingsModule/SuperAdminSettingPage";
import SuperAdminPlansPage from "./components/pages/superAdminPages/plansModule/SuperAdminPlansPage";
import SuperAdminPlansCreate from "./components/pages/superAdminPages/plansModule/SuperAdminPlansCreate";
import LandingRoot from "./routes/LandingRoot";
import LandingPage from "./components/pages/landingPages/LandingPage";
import LandingPricingPage from "./components/pages/landingPages/LandingPricingPage";
import LandingAboutPage from "./components/pages/landingPages/LandingAboutPage";
import AdminSupportHomePage from "./components/pages/adminPages/SupportModule/AdminSupportHomePage";
import AdminSupportViewTicketPage from "./components/pages/adminPages/SupportModule/AdminSupportViewTicketPage";
import AdminNotificationsPage from "./components/pages/adminPages/AdminNotificationsPage";
import SuperAdminSubscriptionPage from "./components/pages/superAdminPages/plansModule/SuperAdminSubscriptionPage";
import SuperAdminDashboard from "./components/pages/superAdminPages/dashboardModule/SuperAdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingRoot />, //Landing Root if have frontend app in this project
    errorElement: <ErrorPage />,
    loader: PageLoader,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/pricing",
        element: <LandingPricingPage />,
      },
      {
        path: "/403",
        element: <ForbiddenPage />,
      },
      {
        path: "/about",
        element: <LandingAboutPage />,
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
        path: "/home",
        element: <AdminDashboardPage />,
      },
      {
        path: "/home/settings",
        element: <AdminSettingPage />,
      },
      {
        path: "/home/support",
        element: <AdminSupportHomePage />,
      },
      {
        path: "/home/notifications",
        element: <AdminNotificationsPage />,
      },
      {
        path: "/home/support/ticket/:ticketId",
        element: <AdminSupportViewTicketPage />,
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
        path: "",
        element: <SuperAdminDashboard />,
      },
      {
        path: "/admin/clients",
        element: <div>profile</div>,
      },
      {
        path: "/admin/billing",
        element: <SuperAdminPlansPage />,
      },
      {
        path: "/admin/billing/add",
        element: <SuperAdminPlansCreate />,
      },
      {
        path: "/admin/billing/edit/:planId",
        element: <SuperAdminPlansCreate />,
      },
      {
        path: "/admin/settings",
        element: <SuperAdminSettingPage />,
      },
      {
        path: "/admin/support/tickets",
        element: <AdminSupportHomePage />,
      },
      {
        path: "/admin/support/tickets/ticket/:ticketId",
        element: <AdminSupportViewTicketPage />,
      },
      {
        path: "/admin/notifications",
        element: <AdminNotificationsPage />,
      },
      {
        path: "/admin/suscriptions",
        element: <SuperAdminSubscriptionPage />,
      },
    ],
  },
]);
