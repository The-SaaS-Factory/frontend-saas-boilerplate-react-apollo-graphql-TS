import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./components/layouts/errors/ErrorPage";
import PageLoader from "./components/ui/loaders/PageLoader";
import AdminRoot from "./routes/AdminRoot";
import SuperAdminRoot from "./routes/SuperAdminRoot";
import AdminDashboardPage from "./pages/adminPages/AdminDashboardPage";
import AdminSettingPage from "./pages/adminPages/AdminSettingPage";
import ForbiddenPage from "./components/layouts/errors/ForbiddenPage";
import SuperAdminSettingPage from "./pages/superAdminPages/superAdminSettingsModule/SuperAdminSettingPage";
import SuperAdminPlansPage from "./pages/superAdminPages/plansModule/SuperAdminPlansPage";
import SuperAdminPlansCreate from "./pages/superAdminPages/plansModule/SuperAdminPlansCreate";
import LandingRoot from "./routes/LandingRoot";
import LandingPage from "./pages/landingPages/LandingPage";
import LandingPricingPage from "./pages/landingPages/LandingPricingPage";
import LandingAboutPage from "./pages/landingPages/LandingAboutPage";
import AdminSupportHomePage from "./pages/adminPages/SupportModule/AdminSupportHomePage";
import AdminSupportViewTicketPage from "./pages/adminPages/SupportModule/AdminSupportViewTicketPage";
import AdminNotificationsPage from "./pages/adminPages/AdminNotificationsPage";
import SuperAdminSubscriptionPage from "./pages/superAdminPages/plansModule/SuperAdminSubscriptionPage";
import SuperAdminDashboard from "./pages/superAdminPages/dashboardModule/SuperAdminDashboard";
import SuperAdminUsersModulePage from "./pages/superAdminPages/usersModule/SuperAdminUsersModulePage";
import SuperAdminOrganizationModulePage from "./pages/superAdminPages/organizationModule/SuperAdminOrganizationModulePage";
import SuperAdminInvoiceModulePage from "./pages/superAdminPages/invoiceModule/SuperAdminInvoiceModulePage";

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
        path: "/admin/users",
        element: <SuperAdminUsersModulePage />, 
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
      {
        path: "/admin/invoices",
        element: <SuperAdminInvoiceModulePage />,
      },
      {
        path: "/admin/organizations",
        element: <SuperAdminOrganizationModulePage />,
      },
    ],
  },
]);
