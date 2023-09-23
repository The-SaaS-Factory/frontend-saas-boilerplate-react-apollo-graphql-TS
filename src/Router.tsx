import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  useNavigate,
} from "react-router-dom";

import AdminHome from "./pages/admin/AdminHome";
import TemplateAdmin from "./components/layouts/TemplateAdmin";
import TemplateSuperAdmin from "./components/layouts/TemplateSuperAdmin";
import SuperAdminUsersPage from "./pages/superAdmin/users/SuperAdminUsersPage";
import SuperAdminSettingsPage from "./pages/superAdmin/settings/SuperAdminSettingsPage";
import SuperAdminPlansPage from "./pages/superAdmin/plans/SuperAdminPlansPage";
import SuperAdminPlansCreate from "./pages/superAdmin/plans/SuperAdminPlansCreate";
import SubscriptionsPage from "./pages/admin/BillingModule/SubscriptionsPage";
import AdminBuyPlan from "./pages/admin/BillingModule/AdminBuyPlan";
import SuperAdminSubscriptionPage from "./pages/superAdmin/subscriptions/SuperAdminSubscriptionPage";
import SuperAdminDashboard from "./pages/superAdmin/dashboard/SuperAdminDashboard";
import SuperAdminFrontendSettingsPage from "./pages/superAdmin/settings/SuperAdminFrontendSettingsPage";
import SuperAdminMarketingPage from "./pages/superAdmin/settings/SuperAdminMarketingPage";
import SettingProfilePage from "./pages/platform/profile/SettingsProfilePage";
import LoginPage from "./pages/platform/auth/LoginPage";
import ForgotPassword from "./pages/platform/auth/ForgotPassword";
import PrivatePages from "./components/layouts/PrivatePages";
import NotificationsPage from "./pages/platform/profile/NotificationsPage";
import SupportHomePage from "./pages/admin/SupportModule/SupportHomePage";
import SupportViewTicketPage from "./pages/admin/SupportModule/SupportViewTicketPage";
import SuperAdminSupportTicketViewPage from "./pages/superAdmin/modules/supports/tickets/SuperAdminSupportTicketViewPage";
import SuperAdminSupportPage from "./pages/superAdmin/modules/supports/SuperAdminSupportPage";
 
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<TemplateSuperAdmin />}>
        <Route element={<PrivatePages middleware="superAdmin" />}>
          <Route
            key={"/admin"}
            path="/admin"
            element={<SuperAdminDashboard />}
          />
          <Route
            key={"/admin/users"}
            path="/admin/users"
            element={<SuperAdminUsersPage />}
          />
          <Route
            key={"/admin/settings"}
            path="/admin/settings"
            element={<SuperAdminSettingsPage />}
          />
          <Route
            key={"/admin/profile/settings"}
            path="/admin/profile/settings"
            element={<SettingProfilePage />}
          />
          <Route
            key={"/admin/frontend/settings"}
            path="/admin/frontend/settings"
            element={<SuperAdminFrontendSettingsPage />}
          />
          <Route
            key={"/admin/support"}
            path="/admin/support"
            element={<SuperAdminSupportPage />}
          />
          <Route
            key={"/admin/support/ticket"}
            path="/admin/support/ticket/:ticketId"
            element={<SuperAdminSupportTicketViewPage />}
          />
          <Route
            key={"/admin/marketing/settings"}
            path="/admin/marketing/settings"
            element={<SuperAdminMarketingPage />}
          />
          <Route
            key={"/admin/plans"}
            path="/admin/plans"
            element={<SuperAdminPlansPage />}
          />
          <Route
            key={"/admin/subscriptions"}
            path="/admin/subscriptions"
            element={<SuperAdminSubscriptionPage />}
          />
          <Route
            key={"/admin/plans/add"}
            path="/admin/plans/add"
            element={<SuperAdminPlansCreate />}
          />
          <Route
            key={"/admin/notifications"}
            path="/admin/notifications"
            element={<NotificationsPage />}
          />
          <Route
            key={"/admin/plans/edit"}
            path="/admin/plans/edit/:planId"
            element={<SuperAdminPlansCreate />}
          />
        </Route>{" "}
      </Route>
      <Route element={<TemplateAdmin />}>
        <Route element={<PrivatePages middleware="admin" />}>
          <Route
            key={"/"}
            path="/"
            element={<AdminHome />}
            action={async ({ params, request }) => {
              const navigate = useNavigate();
              navigate("hh");
            }}
          />
          <Route
            key={"/home"}
            path="/home"
            element={<AdminHome />}
            action={async ({ params, request }) => {
              const navigate = useNavigate();
              navigate("hh");
            }}
          />
          <Route
            key={"/home/settings"}
            path="/home/settings"
            element={<SettingProfilePage />}
          />
          <Route
            key={"/home/support"}
            path="/home/support"
            element={<SupportHomePage />}
          />
          <Route
            key={"/home/support/ticket"}
            path="/home/support/ticket/:ticketId"
            element={<SupportViewTicketPage />}
          />
          <Route
            key={"/home/billing/subscriptions"}
            path="/home/billing/subscriptions"
            element={<SubscriptionsPage />}
          />
          <Route
            key={"/home/billing/subscriptions/paymentCompleted"}
            path="/home/billing/subscriptions/:paymentCompleted"
            element={<SubscriptionsPage />}
          />
          <Route
            key={"/home/billing/plans"}
            path="/home/billing/plans"
            element={<AdminBuyPlan />}
          />
          <Route
            key={"/settings"}
            path="/settings"
            element={<SettingProfilePage />}
          />
          <Route
            key={"/home/notifications"}
            path="/home/notifications"
            element={<NotificationsPage />}
          />
        </Route>{" "}
      </Route>

      <Route
        key={"/auth/login"}
        path="/auth/login/:page"
        element={<LoginPage />}
      />
      <Route
        key={"/auth/forgotpassword"}
        path="/auth/forgotpassword"
        element={<ForgotPassword />}
      />
    </>
  )
);
